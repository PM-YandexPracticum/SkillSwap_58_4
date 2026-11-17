import { createSlice, isAnyOf } from '@reduxjs/toolkit'
import { toggleFavorite } from './toggleFavorite'

export interface FavoriteToggleState {
  /** Повтор одного сердечка блокируется; разные адресаты сохраняются через очередь API. */
  pendingUserIds: string[]
}

const initialState: FavoriteToggleState = { pendingUserIds: [] }

const favoriteToggleSlice = createSlice({
  name: 'favoriteToggle',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(toggleFavorite.pending, (state, action) => {
        state.pendingUserIds.push(action.meta.arg)
      })
      .addMatcher(isAnyOf(toggleFavorite.fulfilled, toggleFavorite.rejected), (state, action) => {
        // Отказ condition не завершает уже выполняющуюся операцию.
        if (toggleFavorite.rejected.match(action) && action.meta.condition) return
        state.pendingUserIds = state.pendingUserIds.filter((id) => id !== action.meta.arg)
      })
  },
})

export const favoriteToggleReducer = favoriteToggleSlice.reducer
