import { createSlice } from '@reduxjs/toolkit'
import { toggleFavorite } from './toggleFavorite'

export interface FavoriteToggleState {
  /** Только одна пара записей обновляется за раз, чтобы лайки не затирали друг друга. */
  isPending: boolean
}

const initialState: FavoriteToggleState = { isPending: false }

const favoriteToggleSlice = createSlice({
  name: 'favoriteToggle',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(toggleFavorite.pending, (state) => {
        state.isPending = true
      })
      .addCase(toggleFavorite.fulfilled, (state) => {
        state.isPending = false
      })
      .addCase(toggleFavorite.rejected, (state) => {
        state.isPending = false
      })
  },
})

export const favoriteToggleReducer = favoriteToggleSlice.reducer
