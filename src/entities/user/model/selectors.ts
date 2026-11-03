/** Все пользователи */
export const selectUsers = (state: RootState) => state.users.items

/** Статус загрузки */
export const selectUsersStatus = (state: RootState) => state.users.status

// TODO: selectUserById(id), selectUserByEmail(email)
// TODO: selectPopularUsers — по полю likesCount (его меняет лайк, P5-07), selectNewUsers — по createdAt; через createSelector
