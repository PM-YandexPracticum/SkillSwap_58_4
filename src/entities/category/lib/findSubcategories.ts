import type { Category, Subcategory } from '../model/types'

/** Находит интересы в порядке выбранных id; отсутствующие подкатегории пропускаются. */
export function findSubcategories(
  categories: readonly Category[],
  ids: readonly string[],
): Subcategory[] {
  const byId = new Map(
    categories.flatMap((category) => category.subcategories.map((sub) => [sub.id, sub] as const)),
  )
  return ids.flatMap((id) => {
    const subcategory = byId.get(id)
    return subcategory ? [subcategory] : []
  })
}
