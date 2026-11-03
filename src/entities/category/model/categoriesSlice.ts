import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import type { LoadingStatus } from '@/shared/types'

import { getCategories } from '../api/categoryApi'
import type { Category } from './types'

export interface CategoriesState {
  items: Category[]
  status: LoadingStatus
}

const initialState: CategoriesState = {
  items: [],
  status: 'idle',
}

/**
 * Справочник категорий. Загружается один раз при старте приложения.
 * Данные приходят из "базы" через entities/category/api.
 */
export const fetchCategories = createAsyncThunk<Category[]>(
  'categories/fetch',
  async () => getCategories(),
)

export const categoriesSlice = createSlice({
  name: 'categories',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchCategories.pending, (state) => {
        state.status = 'loading'
      })
      .addCase(fetchCategories.fulfilled, (state, action) => {
        state.items = action.payload
        state.status = 'succeeded'
      })
      .addCase(fetchCategories.rejected, (state) => {
        state.status = 'failed'
      })
  },
})

export const categoriesReducer = categoriesSlice.reducer
