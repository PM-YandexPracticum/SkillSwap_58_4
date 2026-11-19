import { configureStore } from '@reduxjs/toolkit'
import { catalogFilterReducer } from '../model/catalogFilterSlice'

export function createStoryStore() {
  return configureStore({
    reducer: {
      catalogFilter: catalogFilterReducer
    },
  })
}

