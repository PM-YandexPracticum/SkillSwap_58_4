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
    // Новое состояние даже при том же запросе: явная команда должна заменить черновик поля.
    /** Применённый запрос (Enter / клик по лупе). Пустая строка = поиск сброшен */
    queryApplied: (_state, action: PayloadAction<string>) => ({ query: action.payload.trim() }),
    /** Сброс из поля или общего управления каталогом */
    queryCleared: () => ({ query: '' }),
  },
})

export const { queryApplied, queryCleared } = searchSlice.actions
export const searchReducer = searchSlice.reducer

export interface SearchSliceState {
  search: SearchState
}

/** Состояние последней команды поиска — для синхронизации черновика поля */
export const selectSearchState = (state: SearchSliceState) => state.search
/** Текущая поисковая строка */
export const selectSearchQuery = (state: SearchSliceState) => selectSearchState(state).query
/** Активен ли поиск (есть непустой запрос) */
export const selectIsSearchActive = (state: SearchSliceState) => state.search.query !== ''
