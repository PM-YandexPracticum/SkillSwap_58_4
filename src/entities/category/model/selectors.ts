import { createSelector } from '@reduxjs/toolkit'
import { createLookup } from '@/shared/lib/createLookup'
import { getSubcategoryLookup } from '../lib/findSubcategories'
import type { ID } from '@/shared/types'

/** Все категории */
export const selectCategories = (state: RootState) => state.categories.items

/** Статус загрузки справочника */
export const selectCategoriesStatus = (state: RootState) => state.categories.status

const selectCategoryLookup = createSelector([selectCategories], (categories) =>
  createLookup(categories, (category) => category.id),
)

/** Подкатегория через общий индекс. */
export const selectSubcategoryById = (state: RootState, subcategoryId: ID) =>
  getSubcategoryLookup(selectCategories(state))(subcategoryId)

/** Категория подкатегории; оба поиска используют кешируемые индексы. */
export const selectCategoryBySubcategoryId = (state: RootState, subcategoryId: ID) => {
  const subcategory = selectSubcategoryById(state, subcategoryId)
  return subcategory ? selectCategoryLookup(state)(subcategory.categoryId) : undefined
}

/** Цвет категории или undefined, если категория отсутствует. */
export const selectCategoryColor = (state: RootState, categoryId: ID): string | undefined =>
  selectCategoryLookup(state)(categoryId)?.color
