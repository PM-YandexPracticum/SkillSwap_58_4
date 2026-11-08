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
 * Справочник категорий. Загружается по запросу страницы/меню и доступен через селекторы.
 * Данные приходят из «базы» через entities/category/api.
 */
export const fetchCategories = createAsyncThunk<
  Category[],
  void,
  { state: { categories: CategoriesState } }
>('categories/fetch', async () => getCategories(), {
  // Общий справочник для страницы и меню: один запрос, включая повтор эффектов StrictMode.
  condition: (_, { getState }) => {
    const { status } = getState().categories
    return status === 'idle' || status === 'failed'
  },
})

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
