import { createSlice, type PayloadAction } from '@reduxjs/toolkit'

export interface SearchState {
  query: string
}

const initialState: SearchState = {
  query: '',
}

/**
 * Строка поиска в шапке («Искать навык»).
 * В store попадает только применённый запрос - по Enter или клику на лупу;
 * набираемый текст живёт в самом поле.
 */
export const searchSlice = createSlice({
  name: 'search',
  initialState,
  reducers: {
    /** Применённый запрос (Enter / клик по лупе). Пустая строка = поиск сброшен */
    queryApplied(state, action: PayloadAction<string>) {
      state.query = action.payload.trim()
    },
    /** Крестик в поле - каталог возвращается к секциям */
    queryCleared(state) {
      state.query = ''
    },
  },
})

export const { queryApplied, queryCleared } = searchSlice.actions
export const searchReducer = searchSlice.reducer

export interface SearchSliceState {
  search: SearchState
}

/** Текущая поисковая строка */
export const selectSearchQuery = (state: SearchSliceState) => state.search.query
/** Активен ли поиск (есть непустой запрос) */
export const selectIsSearchActive = (state: SearchSliceState) => state.search.query !== ''
