import { MOCK_DB } from '@/shared/config'

/** Любая запись «базы» обязана иметь строковый id */
export interface WithId {
  id: string
}

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

export interface MockCollectionOptions {
  /** Задержка каждого ответа, мс. По умолчанию `MOCK_DB.DELAY_MS`; в тестах коллекций — 0 */
  delayMs?: number
}

/** Изменения коллекций, если localStorage недоступен (запрет сохранения данных в браузере). Живут до перезагрузки */
const memoryStore = new Map<string, string>()

const storageKey = (name: string) => `${MOCK_DB.STORAGE_PREFIX}${name}`

/** Глубокая копия: данные «базы» — обычный JSON, поэтому так надёжнее всего */
const clone = <V>(value: V): V => JSON.parse(JSON.stringify(value)) as V

const wait = (ms: number) =>
  ms > 0 ? new Promise<void>((resolve) => setTimeout(resolve, ms)) : Promise.resolve()

function isRecordList(value: unknown): value is WithId[] {
  return (
    Array.isArray(value) &&
    value.every(
      (item) =>
        typeof item === 'object' && item !== null && typeof (item as WithId).id === 'string',
    )
  )
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

/** Записи коллекции: сохранённые изменения, а если их нет или они повреждены — копия образцов */
function readList<T extends WithId>(key: string, seed: readonly T[]): T[] {
  const saved = readSaved(key)
  if (saved === null) return clone([...seed])
  try {
    const parsed: unknown = JSON.parse(saved)
    if (isRecordList(parsed)) return parsed as T[]
  } catch {
    // не JSON — ниже сбрасываем к образцам
  }
  removeSaved(key)
  return clone([...seed])
}

/** @throws {Error} если в localStorage не хватает места (фото хранятся прямо в записях) */
function writeList<T extends WithId>(key: string, list: readonly T[]): void {
  const value = JSON.stringify(list)
  try {
    localStorage.setItem(key, value)
    memoryStore.delete(key)
  } catch (error) {
    if (isQuotaError(error)) {
      throw new Error(
        'Не хватает места в браузере, чтобы сохранить данные. Уменьшите фото или сбросьте данные сайта',
      )
    }
    memoryStore.set(key, value)
  }
}

/**
 * Создаёт коллекцию поверх localStorage.
 * - Пока изменений нет, данные — копия `seed` (JSON в `mock-db/seed/`). Первое изменение сохраняет всю коллекцию
 *   в localStorage под ключом `MOCK_DB.STORAGE_PREFIX + name`; дальше она читается оттуда — и после перезагрузки.
 * - Каждый метод ждёт `MOCK_DB.DELAY_MS` — имитация запроса к серверу (виден Loader).
 * - Никаких мутаций: каждый ответ — новые объекты; изменить «базу» можно только методами коллекции.
 * - Повреждённые данные в localStorage — сброс к `seed`; localStorage недоступен — изменения живут в памяти до перезагрузки.
 *
 * Переход на настоящую БД: эта функция (или файлы `entities/*\/api/*Api.ts`) меняется на запросы к серверу,
 * остальной код не трогается.
 * @param name имя коллекции: `users`, `skills`, `categories`, `cities`, `exchanges`, `notifications`
 * @param seed начальные данные
 */
export function createMockCollection<T extends WithId>(
  name: string,
  seed: readonly T[],
  { delayMs = MOCK_DB.DELAY_MS }: MockCollectionOptions = {},
): MockCollection<T> {
  const key = storageKey(name)
  const read = () => readList(key, seed)
  const respond = async <R>(action: () => R): Promise<R> => {
    await wait(delayMs)
    return action()
  }

  return {
    getAll: () => respond(read),
    getById: (id) => respond(() => read().find((item) => item.id === id)),
    create: (item) =>
      respond(() => {
        const list = read()
        if (list.some((existing) => existing.id === item.id)) {
          throw new Error(`Запись с id «${item.id}» уже есть в коллекции «${name}»`)
        }
        const created = clone(item)
        writeList(key, [...list, created])
        return clone(created)
      }),
    update: (id, changes) =>
      respond(() => {
        const list = read()
        const current = list.find((item) => item.id === id)
        if (!current) throw new Error(`Запись с id «${id}» не найдена в коллекции «${name}»`)
        const updated: T = { ...current, ...clone(changes), id }
        writeList(
          key,
          list.map((item) => (item.id === id ? updated : item)),
        )
        return clone(updated)
      }),
    remove: (id) =>
      respond(() => {
        const list = read()
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
 * Стирает все изменения «базы» — данные снова как в `seed`. Сессию и тему не трогает.
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
