import { createSlice } from '@reduxjs/toolkit'

export interface SearchState {
  query: string
}

const initialState: SearchState = {
  query: '',
}

/**
 * Строка поиска в шапке («Искать навык»).
 * В store попадает только применённый запрос — по Enter или клику на лупу; набираемый текст живёт в самом поле.
 * TODO: queryApplied(query), queryCleared
 */
export const searchSlice = createSlice({
  name: 'search',
  initialState,
  reducers: {},
})

export const searchReducer = searchSlice.reducer

/** Текущая поисковая строка */
export const selectSearchQuery = (state: RootState) => state.search.query
