import type { ItemGuard } from './createMockCollection'

/** Загрузки, которые уже начались: файл каждой коллекции скачивается один раз */
const loading = new Map<string, Promise<unknown[]>>()

async function fetchSeed(name: string): Promise<unknown[]> {
  const error = new Error(`Не удалось загрузить данные «${name}»`)
  const response = await fetch(`${import.meta.env.BASE_URL}db/${name}.json`).catch(() => {
    throw error
  })
  if (!response.ok) throw error
  const data: unknown = await response.json().catch(() => {
    throw error
  })
  if (!Array.isArray(data)) throw error
  return data
}

/**
 * Загрузчик образцов коллекции из `public/db/<name>.json` — для второго аргумента `createMockCollection`.
 * Файл скачивается через `fetch` при первом обращении к коллекции и дальше берётся из памяти.
 * Если загрузка не удалась, следующая попытка скачивает файл заново.
 *
 * Валидатор сущности проверяет записи до кеширования результата для вызывающего кода.
 * Ошибочный seed удаляется из кеша; после исправления файла запрос можно повторить.
 * @param name имя коллекции и файла: `users` → `public/db/users.json`
 * @returns функция, которая отдаёт образцы; @throws {Error} «Не удалось загрузить данные …»
 */
export function loadSeed<T>(name: string, validate?: ItemGuard<T>): () => Promise<readonly T[]> {
  return () => {
    const started = loading.get(name) ?? fetchSeed(name)
    loading.set(name, started)
    return started
      .then((data) => {
        if (validate && !data.every(validate))
          throw new Error(`Не удалось загрузить данные «${name}»`)
        return data as T[]
      })
      .catch((error: unknown) => {
        if (loading.get(name) === started) loading.delete(name)
        throw error
      })
  }
}
