import { createSelector } from '@reduxjs/toolkit'
import { createLookup } from '@/shared/lib/createLookup'
import type { Category, Subcategory } from '../model/types'

/** Один индекс на версию справочника, общий для всех карточек. */
export const getSubcategoryLookup = createSelector(
  [(categories: readonly Category[]) => categories],
  (categories) =>
    createLookup(
      categories.flatMap((category) => category.subcategories),
      (sub) => sub.id,
    ),
)

/** Находит интересы в порядке выбранных id; отсутствующие подкатегории пропускаются. */
export function findSubcategories(
  categories: readonly Category[],
  ids: readonly string[],
): Subcategory[] {
  const lookup = getSubcategoryLookup(categories)
  return ids.flatMap((id) => {
    const subcategory = lookup(id)
    return subcategory ? [subcategory] : []
  })
}
