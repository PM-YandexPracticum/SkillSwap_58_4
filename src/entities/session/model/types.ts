import type { ID } from '@/shared/types'

/**
 * Текущая сессия. Бекенда нет: «токен» — мок, хранится в localStorage.
 * Профильные данные берутся из entities/user по `userId`.
 */
export interface Session {
  userId: ID
  token: string
}
