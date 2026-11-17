import { combineReducers } from '@reduxjs/toolkit'
import { categoriesReducer } from '@/entities/category'
import { citiesReducer } from '@/entities/city'
import { exchangesReducer } from '@/entities/exchange'
import { notificationsReducer } from '@/entities/notification'
import { sessionReducer } from '@/entities/session'
import { skillsReducer } from '@/entities/skill'
import { usersReducer } from '@/entities/user'
import { catalogFilterReducer } from '@/features/catalog-filter'
import { favoriteToggleReducer } from '@/features/favorite-toggle'
import { registerReducer } from '@/features/register'
import { searchReducer } from '@/features/skill-search'

/** Корневой редьюсер. Новый слайс = одна строка здесь. */
export const rootReducer = combineReducers({
  // entities
  categories: categoriesReducer,
  cities: citiesReducer,
  exchanges: exchangesReducer,
  notifications: notificationsReducer,
  session: sessionReducer,
  skills: skillsReducer,
  users: usersReducer,
  // features
  catalogFilter: catalogFilterReducer,
  favoriteToggle: favoriteToggleReducer,
  register: registerReducer,
  search: searchReducer,
})
