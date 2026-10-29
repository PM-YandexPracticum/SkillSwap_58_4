import categories from './categories.json'
import cities from './cities.json'
import exchanges from './exchanges.json'
import notifications from './notifications.json'
import { skills } from './skills'
import { users } from './users'

/**
 * Начальные данные «базы». Это образцы — по 2–3 записи на сущность, остальное заполняет команда.
 * Тип каждой записи описан в сущности (`entities/*\/model/types.ts`) — там же данные и приводятся к типу.
 */
export const SEED = {
  users,
  skills,
  categories: categories as readonly unknown[],
  cities: cities as readonly unknown[],
  exchanges: exchanges as readonly unknown[],
  notifications: notifications as readonly unknown[],
} as const
