import type { ID } from '@/shared/types'

/** Все категории */
export const selectCategories = (state: RootState) => state.categories.items

/** Статус загрузки справочника */
export const selectCategoriesStatus = (state: RootState) => state.categories.status

/** Подкатегория по id (или undefined, если не найдена) */
export const selectSubcategoryById = (state: RootState, subcategoryId: ID) => {
  for (const category of state.categories.items) {
    const found = category.subcategories.find((sub) => sub.id === subcategoryId)
    if (found) return found
  }
  return undefined
}

/** Категория, к которой относится подкатегория (или undefined) */
export const selectCategoryBySubcategoryId = (state: RootState, subcategoryId: ID) =>
  state.categories.items.find((category) =>
    category.subcategories.some((sub) => sub.id === subcategoryId),
  )

/**
 * Цвет категории для чипа навыка (или undefined).
 * Для подкатегории сначала найдите её категорию: `selectCategoryBySubcategoryId`.
 */
export const selectCategoryColor = (state: RootState, categoryId: ID): string | undefined =>
  state.categories.items.find((category) => category.id === categoryId)?.color
