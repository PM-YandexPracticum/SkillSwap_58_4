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
  /** Атомарно вернуть существующую запись по ключу либо создать новую, не меняя существующую. */
  createIfAbsent(item: T, keyOf: (item: T) => string): Promise<T>
  /** Изменить поля записи — возвращает новую запись. @throws {Error} если id не найден */
  update(id: string, changes: Partial<Omit<T, 'id'>>): Promise<T>
  /** Читает актуальные данные в очереди и сохраняет несколько изменений одной записью. */
  updateMany(
    getChanges: (items: readonly T[]) => readonly { id: string; changes: Partial<Omit<T, 'id'>> }[],
  ): Promise<T[]>
  /** Удалить запись. Если её нет — ничего не происходит */
  remove(id: string): Promise<void>
  /**
   * Пакетно изменить записи, для которых `match` вернул `true`; остальные (включая чужие)
   * остаются как есть. Одно чтение, одна запись и одна задержка на весь пакет.
   * Возвращает полный список после изменений. Если реально ничего не изменилось —
   * в localStorage не пишет (сравнение по содержимому).
   * @throws {Error} если сохранение в localStorage упало — ошибка наружу, не глотаем
   */
  updateMany(
    match: (item: Readonly<T>) => boolean,
    patch: (item: Readonly<T>) => Partial<Omit<T, 'id'>>,
  ): Promise<T[]>
  /**
   * Пакетно удалить записи, для которых `match` вернул `true`; остальные не трогает.
   * Одно чтение, одна запись и одна задержка на весь пакет.
   * Возвращает id удалённых записей.
   * @throws {Error} если сохранение в localStorage упало — ошибка наружу, не глотаем
   */
  removeMany(match: (item: Readonly<T>) => boolean): Promise<string[]>
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
  validateWrite?: (item: Readonly<T>, items: readonly T[], operation: 'create' | 'update') => void
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

  function insert(list: T[], item: T): T {
    const created = clone(item)
    assertValidItem(created, validate, name)
    validateWrite?.(created, list, 'create')
    if (list.some((existing) => existing.id === item.id)) {
      throw new Error(`Запись с id «${item.id}» уже есть в коллекции «${name}»`)
    }
    writeList(key, [...list, created])
    return clone(created)
  }

  const updateMany: MockCollection<T>['updateMany'] = (getChanges) =>
    respond(async () => {
      const list = await read()
      const changes = getChanges(clone(list))
      if (changes.length === 0) return []
      const currentById = new Map(list.map((item) => [item.id, item]))
      const updatedById = new Map<string, T>()
      for (const { id, changes: fields } of changes) {
        const current = currentById.get(id)
        if (!current) throw new Error(`Запись с id «${id}» не найдена в коллекции «${name}»`)
        if (updatedById.has(id))
          throw new Error(`Повтор id «${id}» в изменениях коллекции «${name}»`)
        const updated = { ...current, ...clone(fields), id }
        assertValidItem(updated, validate, name)
        updatedById.set(id, updated)
      }
      const next = list.map((item) => updatedById.get(item.id) ?? item)
      for (const updated of updatedById.values()) validateWrite?.(updated, next, 'update')
      writeList(key, next)
      return clone([...updatedById.values()])
    })

  return {
    getAll: () => respond(read),
    getById: (id) => respond(async () => (await read()).find((item) => item.id === id)),
    create: (item) => respond(async () => insert(await read(), item)),
    createIfAbsent: (item, keyOf) => {
      const input = clone(item)
      return respond(async () => {
        assertValidItem(input, validate, name)
        const list = await read()
        const key = keyOf(input)
        const existing = list.find((saved) => keyOf(saved) === key)
        return existing ? clone(existing) : insert(list, input)
      })
    },
    update: (id, changes) => {
      const input = clone(changes)
      return updateMany(() => [{ id, changes: input }]).then(([updated]) => updated)
    },
    updateMany,
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
    updateMany: (match, patch) =>
      respond(async () => {
        const list = await read()
        let changed = false
        const next = list.map((item) => {
          // не подошёл под фильтр — отдаём как есть, не трогаем чужие записи
          if (!match(item)) return item
          // id всегда принудительно из исходной записи — патч не может его подменить
          const updated: T = { ...item, ...clone(patch(item)), id: item.id }
          assertValidItem(updated, validate, name)
          validateWrite?.(updated, list, 'update')
          // сравнение по содержимому: пустой патч не даст лишний setItem
          if (JSON.stringify(updated) !== JSON.stringify(item)) changed = true
          return updated
        })
        // пишем в localStorage, только если реально что-то поменялось
        if (changed) writeList(key, next)
        // наружу — копии, чтобы никто не мутировал «базу»
        return next.map(clone)
      }),
    removeMany: (match) =>
      respond(async () => {
        const list = await read()
        // фиксируем «кого удаляем» до записи — фильтр должен сработать один раз
        const removed = list.filter(match)
        // выходим без записи, если удалять нечего
        if (removed.length) {
          writeList(
            key,
            list.filter((item) => !match(item)),
          )
        }
        return removed.map((item) => item.id)
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
