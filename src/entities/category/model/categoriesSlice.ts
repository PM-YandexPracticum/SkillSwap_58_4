import { createSlice } from '@reduxjs/toolkit'
import type { LoadingStatus } from '@/shared/types'
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
 * TODO: extraReducers для fetchCategories (pending / fulfilled / rejected)
 */
export const categoriesSlice = createSlice({
  name: 'categories',
  initialState,
  reducers: {},
})

export const categoriesReducer = categoriesSlice.reducer
