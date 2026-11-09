import { createSelector } from '@reduxjs/toolkit'
import type { ID } from '@/shared/types'
import type { PublicUser, User } from './types'

/** Общая проекция для UI: учебный пароль остаётся только в store и API. */
function toPublicUser({ password: _password, ...publicUser }: User): PublicUser {
  return publicUser
}

const selectStoredUsers = (state: RootState) => state.users.items

/** Все пользователи без паролей; ссылка стабильна, пока список в store не изменился. */
export const selectUsers = createSelector([selectStoredUsers], (users): PublicUser[] =>
  users.map(toPublicUser),
)

/** Статус загрузки */
export const selectUsersStatus = (state: RootState) => state.users.status

/** Пользователь для компонента по id; undefined, если его нет. */
export const selectUserById = (state: RootState, userId: ID): PublicUser | undefined =>
  selectUsers(state).find((user) => user.id === userId)

/**
 * Полная запись только для логики входа (P4-09) и проверки уникальности email (P4-06).
 * Сравнивает email без учёта регистра и краевых пробелов. Не передавать результат в UI:
 * для компонентов используются selectUsers / selectUserById с типом PublicUser.
 */
export const selectUserByEmail = (state: RootState, email: string): User | undefined => {
  const normalizedEmail = email.trim().toLowerCase()
  return selectStoredUsers(state).find(
    (user) => user.email.trim().toLowerCase() === normalizedEmail,
  )
}

/** Все пользователи по убыванию likesCount, без изменения исходного порядка в store. */
export const selectPopularUsers = createSelector([selectUsers], (users): PublicUser[] =>
  [...users].sort((a, b) => b.likesCount - a.likesCount),
)

/** Все пользователи от новых к старым; при одинаковой дате сохраняется порядок загрузки. */
export const selectNewUsers = createSelector([selectUsers], (users): PublicUser[] =>
  [...users].sort((a, b) => Date.parse(b.createdAt) - Date.parse(a.createdAt)),
)

/** Порядок один раз перемешан в fetchUsers; лайки и чтение селектора его не меняют. */
export const selectRecommendedUsers = selectUsers
