import { selectCurrentUser } from '@/entities/user'

/**
 * id пользователей в избранном у текущего пользователя (`likedUserIds`).
 * Гость — пустой массив. Используется на странице «Избранное» и в сердечке на карточке.
 */
export const selectFavoriteIds = (state: RootState): string[] =>
  selectCurrentUser(state)?.likedUserIds ?? []

// TODO: selectIsFavorite(userId) и selectFavoriteUsers — через createSelector
