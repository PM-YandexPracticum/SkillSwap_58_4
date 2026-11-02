import { configureStore } from '@reduxjs/toolkit'
import { rootReducer } from './rootReducer'

/**
 * Создаёт новый store. Приложение вызывает её один раз (ниже), тесты — в каждом тесте заново,
 * чтобы состояние одного теста не протекало в другой.
 * @param preloadedState начальное состояние для теста: `{ session: { ... } }`; остальное — из редьюсеров
 */
export function createAppStore(preloadedState?: Partial<RootState>) {
  return configureStore({
    reducer: rootReducer,
    preloadedState,
  })
}

/** Store приложения */
export const store = createAppStore()

/** Тип store — для тестовых помощников, которым нужен store целиком */
export type AppStore = ReturnType<typeof createAppStore>

/**
 * Глобальные типы стора. Объявлены глобально, чтобы нижние слои (entities, features, shared)
 * могли типизировать селекторы, не импортируя ничего из app — это нарушило бы правило FSD.
 */
declare global {
  type RootState = ReturnType<typeof rootReducer>
  type AppDispatch = typeof store.dispatch
}
