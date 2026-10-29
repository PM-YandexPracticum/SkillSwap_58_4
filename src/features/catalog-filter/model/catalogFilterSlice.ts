import { createSlice } from '@reduxjs/toolkit'
import type { CatalogFilterState } from './types'

const initialState: CatalogFilterState = {
  mode: 'all',
  subcategoryIds: [],
  gender: null,
  cityIds: [],
  sort: 'newest',
}

/**
 * Фильтры каталога. Когда выбран хотя бы один фильтр или введён поиск — секции «Популярное / Новое / Рекомендуем»
 * заменяются на «Подходящие предложения: N»: плашки фильтров, сортировка и лента с догрузкой.
 * TODO: setMode, toggleSubcategory, toggleCategory, setGender, toggleCity, setSort, removeFilter, resetFilters
 */
export const catalogFilterSlice = createSlice({
  name: 'catalogFilter',
  initialState,
  reducers: {},
})

export const catalogFilterReducer = catalogFilterSlice.reducer
