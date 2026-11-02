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
 * Тип записей не проверяется — он описан в сущности (`entities/*\/model/types.ts`).
 * @param name имя коллекции и файла: `users` → `public/db/users.json`
 * @returns функция, которая отдаёт образцы; @throws {Error} «Не удалось загрузить данные …»
 */
export function loadSeed<T>(name: string): () => Promise<readonly T[]> {
  return () => {
    const started = loading.get(name) ?? fetchSeed(name)
    loading.set(name, started)
    started.catch(() => loading.delete(name))
    return started as Promise<readonly T[]>
  }
}
