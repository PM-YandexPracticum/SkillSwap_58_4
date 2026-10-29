/** Текущие фильтры */
export const selectCatalogFilter = (state: RootState) => state.catalogFilter

/** Количество активных фильтров — для заголовка «Фильтры (N)» */
export const selectActiveFiltersCount = (state: RootState) => {
  const { mode, subcategoryIds, gender, cityIds } = state.catalogFilter
  return (mode === 'all' ? 0 : 1) + subcategoryIds.length + (gender ? 1 : 0) + cityIds.length
}
