import { selectCurrentUser } from '@/entities/user'
import { createSelector } from '@reduxjs/toolkit'

const EMPTY_FAVORITE_IDS: string[] = []

/**
 * id пользователей в избранном у текущего пользователя (`likedUserIds`).
 * Гость — пустой массив. Используется на странице «Избранное» и в сердечке на карточке.
 */
export const selectFavoriteIds = createSelector(
  [selectCurrentUser],
  (currentUser): string[] => currentUser?.likedUserIds ?? EMPTY_FAVORITE_IDS,
)

export const selectFavoriteTogglePending = (state: RootState, userId: string): boolean =>
  state.favoriteToggle.pendingUserIds.includes(userId)
