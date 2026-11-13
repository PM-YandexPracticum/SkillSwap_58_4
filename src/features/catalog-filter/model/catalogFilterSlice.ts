import { createSlice, type PayloadAction } from '@reduxjs/toolkit'
import { createLookup } from '@/shared/lib/createLookup'
import type { CatalogFilterState, FilterMode, FilterRemoval, SortOrder } from './types'

const initialState: CatalogFilterState = {
  mode: 'all',
  subcategoryIds: [],
  gender: null,
  cityIds: [],
  sort: 'newest',
}

/** Переключает id, сохраняя порядок выбранных значений. */
function toggleId(ids: readonly string[], id: string): string[] {
  const findId = createLookup(ids, (value) => value)
  return findId(id) === undefined ? [...ids, id] : ids.filter((value) => value !== id)
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
      state.subcategoryIds = toggleId(state.subcategoryIds, action.payload)
    },
    // UI передаёт id всех подкатегорий категории; справочники в reducer не читаем.
    toggleCategory: (state, action: PayloadAction<readonly string[]>) => {
      const subcategoryIds = [...new Set(action.payload)]
      if (subcategoryIds.length === 0) return
      const findSelected = createLookup(state.subcategoryIds, (id) => id)
      const isSelected = subcategoryIds.every((id) => findSelected(id) !== undefined)
      if (isSelected) {
        const findCategoryId = createLookup(subcategoryIds, (id) => id)
        state.subcategoryIds = state.subcategoryIds.filter((id) => findCategoryId(id) === undefined)
      } else {
        state.subcategoryIds = [
          ...state.subcategoryIds,
          ...subcategoryIds.filter((id) => findSelected(id) === undefined),
        ]
      }
    },
    setGender: (state, action: PayloadAction<CatalogFilterState['gender']>) => {
      state.gender = action.payload
    },
    toggleCity: (state, action: PayloadAction<string>) => {
      state.cityIds = toggleId(state.cityIds, action.payload)
    },
    setSort: (state, action: PayloadAction<SortOrder>) => {
      state.sort = action.payload
    },
    removeFilter: (state, action: PayloadAction<FilterRemoval>) => {
      const filter = action.payload
      switch (filter.type) {
        case 'mode':
          state.mode = 'all'
          break
        case 'gender':
          state.gender = null
          break
        case 'subcategory':
          state.subcategoryIds = state.subcategoryIds.filter((id) => id !== filter.id)
          break
        case 'city':
          state.cityIds = state.cityIds.filter((id) => id !== filter.id)
          break
      }
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
