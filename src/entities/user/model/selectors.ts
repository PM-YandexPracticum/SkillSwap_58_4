/** Все пользователи */
export const selectUsers = (state: RootState) => state.users.items

/** Статус загрузки */
export const selectUsersStatus = (state: RootState) => state.users.status

// TODO: selectUserById(id), selectUserByEmail(email)
// TODO: selectLikesCount(userId) — сколько пользователей держат его в likedUserIds («Популярное»)
// TODO: selectPopularUsers, selectNewUsers — через createSelector
