/**
 * id пользователей в избранном у текущего пользователя (`likedUserIds`).
 * Гость — пустой массив. Используется на странице «Избранное» и в сердечке на карточке.
 */
export const selectFavoriteIds = (state: RootState): string[] => {
  const userId = state.session.session?.userId
  const viewer = state.users.items.find((user) => user.id === userId)
  return viewer?.likedUserIds ?? []
}

// TODO: selectIsFavorite(userId) и selectFavoriteUsers — через createSelector
