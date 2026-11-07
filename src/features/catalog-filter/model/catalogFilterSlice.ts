import { createSlice, type PayloadAction } from '@reduxjs/toolkit'
import type { CatalogFilterState, FilterMode, FilterRemoval, SortOrder } from './types'

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
 */
export const catalogFilterSlice = createSlice({
  name: 'catalogFilter',
  initialState,
  reducers: {
    setMode: (state, action: PayloadAction<FilterMode>) => {
      state.mode = action.payload
    },
    toggleSubcategory: (state, action: PayloadAction<string>) => {
      const subcategoryId = action.payload
      const index = state.subcategoryIds.indexOf(subcategoryId)
      if (index === -1) state.subcategoryIds.push(subcategoryId)
      else state.subcategoryIds.splice(index, 1)
    },
    // UI передаёт id всех подкатегорий категории; справочники в reducer не читаем.
    toggleCategory: (state, action: PayloadAction<readonly string[]>) => {
      const subcategoryIds = [...new Set(action.payload)]
      if (subcategoryIds.length === 0) return
      const isSelected = subcategoryIds.every((id) => state.subcategoryIds.includes(id))
      if (isSelected) {
        state.subcategoryIds = state.subcategoryIds.filter((id) => !subcategoryIds.includes(id))
      } else {
        state.subcategoryIds.push(
          ...subcategoryIds.filter((id) => !state.subcategoryIds.includes(id)),
        )
      }
    },
    setGender: (state, action: PayloadAction<CatalogFilterState['gender']>) => {
      state.gender = action.payload
    },
    toggleCity: (state, action: PayloadAction<string>) => {
      const cityId = action.payload
      const index = state.cityIds.indexOf(cityId)
      if (index === -1) state.cityIds.push(cityId)
      else state.cityIds.splice(index, 1)
    },
    setSort: (state, action: PayloadAction<SortOrder>) => {
      state.sort = action.payload
    },
    removeFilter: (state, action: PayloadAction<FilterRemoval>) => {
      const filter = action.payload
      if (filter.type === 'mode') state.mode = 'all'
      if (filter.type === 'gender') state.gender = null
      if (filter.type === 'sort') state.sort = 'newest'
      if (filter.type === 'subcategory') {
        state.subcategoryIds = state.subcategoryIds.filter((id) => id !== filter.id)
      }
      if (filter.type === 'city') state.cityIds = state.cityIds.filter((id) => id !== filter.id)
    },
    resetFilters: () => initialState,
  },
})

export const catalogFilterReducer = catalogFilterSlice.reducer
export const {
  setMode,
  toggleSubcategory,
  toggleCategory,
  setGender,
  toggleCity,
  setSort,
  removeFilter,
  resetFilters,
} = catalogFilterSlice.actions
