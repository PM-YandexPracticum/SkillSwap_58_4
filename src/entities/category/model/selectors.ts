/** Все категории */
export const selectCategories = (state: RootState) => state.categories.items

/** Статус загрузки справочника */
export const selectCategoriesStatus = (state: RootState) => state.categories.status

// TODO: selectSubcategoryById(id), selectCategoryBySubcategoryId(id)
