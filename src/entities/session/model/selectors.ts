/** Текущая сессия или null */
export const selectSession = (state: RootState) => state.session.session

/** Авторизован ли пользователь — переключает шапку и доступ к /profile */
export const selectIsAuth = (state: RootState) => state.session.session !== null
