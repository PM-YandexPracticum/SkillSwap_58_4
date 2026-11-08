import { ID } from '@/shared/types'
import { PublicUser } from '../../user/model/types'
import { createSelector } from '@reduxjs/toolkit'
import { shuffle } from '@/shared/lib/shuffle'

/** Все пользователи */
export const selectUsers = (state: RootState) => state.users.items

/** Статус загрузки */
export const selectUsersStatus = (state: RootState) => state.users.status

// TODO:(Готово) selectUserById(id), selectUserByEmail(email)
// TODO:(Готово) selectPopularUsers — по полю likesCount (его меняет лайк, P5-07), selectNewUsers — по createdAt; через createSelector

//пользователь по ID или undefined
export const selectUserById = (state: RootState, userId: ID): PublicUser | undefined => {
  const found = selectUsers(state).find((item) => item.id === userId)
  if (!found) return undefined

  const { password, ...publicUser } = found
  return publicUser
}

//пользователи по почте
export const selectUserByEmail = (state: RootState, email: string): PublicUser | undefined => {
  const found = selectUsers(state).find((item) => item.email === email)
  if (!found) return undefined

  const { password, ...publicUser } = found
  return publicUser
}

//сортировка по лайкам аккаунта
export const selectPopularUsers = createSelector(
  [selectUsers],
  (completeListOfUsers): PublicUser[] => {
    return completeListOfUsers
      .slice()
      .map((item) => {
        const { password, ...publicUser } = item
        return publicUser
      })
      .sort((a, b) => b.likesCount - a.likesCount)
  },
)

//сортировка по разделу Новое
export const selectNewUsers = createSelector([selectUsers], (completeListOfUsers): PublicUser[] => {
  return completeListOfUsers
    .slice()
    .map((item) => {
      const { password, ...publicUser } = item
      return publicUser
    })
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
})

//селектор для раздела Рекомендуем
export const selectRecomendUsers = createSelector([selectUsers], (allUsers): PublicUser[] => {
  const publicUsers = allUsers.map((item) => {
    const { password, ...publicUser } = item
    return publicUser
  })
  return shuffle(publicUsers)
})
