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
  /** Удалить запись */
  remove(id: string): Promise<void>
}

/**
 * Создаёт коллекцию поверх localStorage.
 * - При первом обращении данные берутся из `seed` (JSON в `mock-db/seed/`) и сохраняются в localStorage
 *   под ключом `MOCK_DB.STORAGE_PREFIX + name`; дальше читаются и пишутся оттуда.
 * - Каждый метод ждёт `MOCK_DB.DELAY_MS` — имитация запроса к серверу (виден Loader).
 * - Никаких мутаций: каждое изменение — новый массив и новые объекты.
 * - Ошибки чтения localStorage (повреждённые данные) — сброс к `seed`.
 *
 * Переход на настоящую БД: эта функция (или файлы `entities/*\/api/*Api.ts`) меняется на запросы к серверу,
 * остальной код не трогается.
 * @param name имя коллекции: `users`, `skills`, `categories`, `cities`, `exchanges`, `notifications`
 * @param seed начальные данные
 */
export function createMockCollection<T extends WithId>(
  _name: string,
  _seed: readonly T[],
): MockCollection<T> {
  // TODO: реализовать + тесты (чтение seed, запись, update без мутаций, повреждённый localStorage)
  const notImplemented = (): never => {
    throw new Error('Not implemented: createMockCollection')
  }
  return {
    getAll: notImplemented,
    getById: notImplemented,
    create: notImplemented,
    update: notImplemented,
    remove: notImplemented,
  }
}

/**
 * Стирает все изменения «базы» в localStorage — данные снова как в `seed`.
 * Нужна для тестов, автотестов и кнопки «Сбросить данные» в режиме разработки.
 */
export function resetMockDb(): void {
  // TODO: удалить все ключи с префиксом MOCK_DB.STORAGE_PREFIX
  throw new Error('Not implemented: resetMockDb')
}
