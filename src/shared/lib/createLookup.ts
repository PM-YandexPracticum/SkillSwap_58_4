/**
 * Строит независимый отсортированный индекс для повторного точного поиска по строковому ключу.
 * Подготовка O(n log n), поиск O(log n). Исходный порядок не меняется; при дубле берётся первая запись.
 * Вызывать при изменении коллекции (например, внутри createSelector), а не для каждого поиска.
 */
export function createLookup<T>(items: readonly T[], keyOf: (item: T) => string) {
  const entries = items
    .map((item) => ({ key: keyOf(item), item }))
    .sort((a, b) => (a.key < b.key ? -1 : a.key > b.key ? 1 : 0))

  return (key: string): T | undefined => {
    let left = 0
    let right = entries.length
    while (left < right) {
      const middle = left + Math.floor((right - left) / 2)
      if (entries[middle].key < key) left = middle + 1
      else right = middle
    }
    return entries[left]?.key === key ? entries[left].item : undefined
  }
}
