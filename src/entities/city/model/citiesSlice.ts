import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import type { LoadingStatus } from '@/shared/types'

import { getCities } from '../api/cityApi'
import type { City } from './types'

export interface CitiesState {
  items: City[]
  status: LoadingStatus
}

const initialState: CitiesState = {
  items: [],
  status: 'idle',
}

/**
 * Справочник городов. Нужен фильтру "Город", шагу 2 регистрации и "Личным данным".
 */
export const fetchCities = createAsyncThunk<City[]>('cities/fetch', async () => getCities())

export const citiesSlice = createSlice({
  name: 'cities',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchCities.pending, (state) => {
        state.status = 'loading'
      })
      .addCase(fetchCities.fulfilled, (state, action) => {
        state.items = action.payload
        state.status = 'succeeded'
      })
      .addCase(fetchCities.rejected, (state) => {
        state.status = 'failed'
      })
  },
})

export const citiesReducer = citiesSlice.reducer
