import { DATA_ERRORS, MOCK_DB } from '@/shared/config'

/** Любая запись «базы» обязана иметь строковый id */
export interface WithId {
  id: string
}

/** Runtime-проверка записи, пришедшей из JSON или localStorage. */
export type ItemGuard<T> = (value: unknown) => value is T

/**
 * Коллекция «базы данных» — то, что потом заменится на запросы к настоящему серверу.
 * Все методы асинхронные, как у настоящего API, чтобы при замене не переписывать код вокруг.
 */
export interface MockCollection<T extends WithId> {
  /** Все записи */
  getAll(): Promise<T[]>
  /** Запись по id или undefined */
  getById(id: string): Promise<T | undefined>
  /** Добавить запись. @throws {Error} если запись с таким id уже есть */
  create(item: T): Promise<T>
  /** Изменить поля записи — возвращает новую запись. @throws {Error} если id не найден */
  update(id: string, changes: Partial<Omit<T, 'id'>>): Promise<T>
  /** Удалить запись. Если её нет — ничего не происходит */
  remove(id: string): Promise<void>
}

/**
 * Откуда коллекция берёт образцы: готовый список (в тестах) или загрузчик (`loadSeed('users')` — файл из `public/db`)
 */
export type SeedSource<T> = readonly T[] | (() => Promise<readonly T[]>)

export interface MockCollectionOptions<T extends WithId = WithId> {
  /** Задержка каждого ответа, мс. По умолчанию `MOCK_DB.DELAY_MS`; в тестах коллекций — 0 */
  delayMs?: number
  /** Проверяет обязательные поля записи после JSON.parse. */
  validate?: ItemGuard<T>
  /** Ограничения сущности перед create/update. Проверка и запись выполняются в одной очереди. */
  validateWrite?: (item: Readonly<T>, items: readonly T[]) => void
}

/** Очередь действий каждой коллекции: следующее начинается, когда закончилось предыдущее */
const queues = new Map<string, Promise<unknown>>()

/** Изменения коллекций, если localStorage недоступен (запрет сохранения данных в браузере). Живут до перезагрузки */
const memoryStore = new Map<string, string>()

const storageKey = (name: string) => `${MOCK_DB.STORAGE_PREFIX}${name}`

/** Глубокая копия: данные «базы» — обычный JSON, поэтому так надёжнее всего */
const clone = <V>(value: V): V => JSON.parse(JSON.stringify(value)) as V

const wait = (ms: number) =>
  ms > 0 ? new Promise<void>((resolve) => setTimeout(resolve, ms)) : Promise.resolve()

function isRecordList<T extends WithId>(value: unknown, validate?: ItemGuard<T>): value is T[] {
  return (
    Array.isArray(value) &&
    value.every(
      (item) =>
        typeof item === 'object' && item !== null && typeof (item as WithId).id === 'string',
    ) &&
    (!validate || value.every(validate))
  )
}

function assertValidItem<T extends WithId>(
  item: T,
  validate: ItemGuard<T> | undefined,
  name: string,
): void {
  if (!isRecordList([item], validate)) {
    throw new Error(`Неверная структура записи в коллекции «${name}»`)
  }
}

function isQuotaError(error: unknown): boolean {
  return (
    error instanceof DOMException &&
    (error.name === 'QuotaExceededError' || error.name === 'NS_ERROR_DOM_QUOTA_REACHED')
  )
}

/** Сохранённые изменения коллекции или null, если изменений не было */
function readSaved(key: string): string | null {
  if (memoryStore.has(key)) return memoryStore.get(key) ?? null
  try {
    return localStorage.getItem(key)
  } catch {
    return null
  }
}

function removeSaved(key: string): void {
  memoryStore.delete(key)
  try {
    localStorage.removeItem(key)
  } catch {
    // localStorage недоступен — удалять нечего
  }
}

async function readSeed<T extends WithId>(
  seed: SeedSource<T>,
  validate?: ItemGuard<T>,
): Promise<T[]> {
  const list = typeof seed === 'function' ? await seed() : seed
  if (!isRecordList(list, validate))
    throw new Error('Не удалось загрузить данные: неверная структура записей')
  return clone([...list])
}

/** Записи коллекции: сохранённые изменения, а если их нет или они повреждены — копия образцов */
async function readList<T extends WithId>(
  key: string,
  seed: SeedSource<T>,
  validate?: ItemGuard<T>,
): Promise<T[]> {
  const saved = readSaved(key)
  if (saved === null) return readSeed(seed, validate)
  try {
    const parsed: unknown = JSON.parse(saved)
    if (isRecordList(parsed, validate)) return parsed
  } catch {
    // не JSON — ниже сбрасываем к образцам
  }
  removeSaved(key)
  return readSeed(seed, validate)
}

/** Ставит действие в очередь коллекции — два изменения подряд не затрут друг друга */
function enqueue<R>(key: string, action: () => Promise<R>): Promise<R> {
  const result = (queues.get(key) ?? Promise.resolve()).then(action)
  queues.set(
    key,
    result.catch(() => undefined),
  )
  return result
}

/** @throws {Error} если в localStorage не хватает места (фото хранятся прямо в записях) */
function writeList<T extends WithId>(key: string, list: readonly T[]): void {
  const value = JSON.stringify(list)
  try {
    localStorage.setItem(key, value)
    memoryStore.delete(key)
  } catch (error) {
    if (isQuotaError(error)) {
      throw new Error(DATA_ERRORS.STORAGE_FULL)
    }
    memoryStore.set(key, value)
  }
}

/**
 * Создаёт коллекцию поверх localStorage.
 * - Пока изменений нет, данные — копия образцов `seed` (файл `public/db/<name>.json`). Первое изменение сохраняет всю коллекцию
 *   в localStorage под ключом `MOCK_DB.STORAGE_PREFIX + name`; дальше она читается оттуда — и после перезагрузки.
 * - Каждый метод ждёт `MOCK_DB.DELAY_MS` — имитация запроса к серверу (виден Loader).
 * - Никаких мутаций: каждый ответ — новые объекты; изменить «базу» можно только методами коллекции.
 * - Действия одной коллекции выполняются по очереди — одновременные изменения не затирают друг друга.
 * - Повреждённые данные в localStorage — сброс к `seed`; localStorage недоступен — изменения живут в памяти до перезагрузки.
 *
 * Переход на настоящую БД: эта функция (или файлы `entities/*\/api/*Api.ts`) меняется на запросы к серверу,
 * остальной код не трогается.
 * @param name имя коллекции: `users`, `skills`, `categories`, `cities`, `exchanges`, `notifications`
 * @param seed образцы: загрузчик `loadSeed(name)` (в приложении) или готовый список (в тестах)
 */
export function createMockCollection<T extends WithId>(
  name: string,
  seed: SeedSource<T>,
  { delayMs = MOCK_DB.DELAY_MS, validate, validateWrite }: MockCollectionOptions<T> = {},
): MockCollection<T> {
  const key = storageKey(name)
  const read = () => readList(key, seed, validate)
  const respond = async <R>(action: () => Promise<R>): Promise<R> => {
    await wait(delayMs)
    return enqueue(key, action)
  }

  return {
    getAll: () => respond(read),
    getById: (id) => respond(async () => (await read()).find((item) => item.id === id)),
    create: (item) =>
      respond(async () => {
        const list = await read()
        if (list.some((existing) => existing.id === item.id)) {
          throw new Error(`Запись с id «${item.id}» уже есть в коллекции «${name}»`)
        }
        const created = clone(item)
        assertValidItem(created, validate, name)
        validateWrite?.(created, list)
        writeList(key, [...list, created])
        return clone(created)
      }),
    update: (id, changes) =>
      respond(async () => {
        const list = await read()
        const current = list.find((item) => item.id === id)
        if (!current) throw new Error(`Запись с id «${id}» не найдена в коллекции «${name}»`)
        const updated: T = { ...current, ...clone(changes), id }
        assertValidItem(updated, validate, name)
        validateWrite?.(updated, list)
        writeList(
          key,
          list.map((item) => (item.id === id ? updated : item)),
        )
        return clone(updated)
      }),
    remove: (id) =>
      respond(async () => {
        const list = await read()
        if (list.some((item) => item.id === id)) {
          writeList(
            key,
            list.filter((item) => item.id !== id),
          )
        }
      }),
  }
}

/**
 * Стирает все изменения «базы» — данные снова как в образцах. Сессию и тему не трогает.
 * Нужна для тестов, автотестов и кнопки «Сбросить данные» в режиме разработки.
 */
export function resetMockDb(): void {
  memoryStore.clear()
  try {
    const keys = Array.from({ length: localStorage.length }, (_, index) => localStorage.key(index))
    keys
      .filter((key): key is string => key?.startsWith(MOCK_DB.STORAGE_PREFIX) ?? false)
      .forEach((key) => localStorage.removeItem(key))
  } catch {
    // localStorage недоступен — в нём и сбрасывать нечего
  }
}
