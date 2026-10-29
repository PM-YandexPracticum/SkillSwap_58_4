import { configureStore } from '@reduxjs/toolkit'
import { rootReducer } from './rootReducer'

export const store = configureStore({
  reducer: rootReducer,
})

/**
 * Глобальные типы стора. Объявлены глобально, чтобы нижние слои (entities, features, shared)
 * могли типизировать селекторы, не импортируя ничего из app — это нарушило бы правило FSD.
 */
declare global {
  type RootState = ReturnType<typeof rootReducer>
  type AppDispatch = typeof store.dispatch
}
