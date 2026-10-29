import { createSlice } from '@reduxjs/toolkit'
import type { LoadingStatus } from '@/shared/types'
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
 * Справочник городов (~15). Нужен фильтру «Город», шагу 2 регистрации и «Личным данным».
 * TODO: fetchCities (createAsyncThunk)
 */
export const citiesSlice = createSlice({
  name: 'cities',
  initialState,
  reducers: {},
})

export const citiesReducer = citiesSlice.reducer
