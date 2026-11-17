import { createAsyncThunk } from '@reduxjs/toolkit'

import { selectCurrentUser, selectUserById, updateDataUser } from '@/entities/user'
import { DATA_ERRORS } from '@/shared/config'

function getSaveError(error: unknown): string {
  return Object.values(DATA_ERRORS).find((message) => message === error) ?? DATA_ERRORS.SAVE_USER
}
/**
 * Лайк / снятие лайка. Своего хранилища у избранного нет. Меняются два пользователя (без мутаций — новые объекты):
 * - у текущего пользователя `likedUserIds` (+ id / − id) — из этого строится страница «Избранное»;
 * - у того, кого лайкнули, `likesCount` (+1 / −1) — это счётчик на карточке и сортировка «Популярного».
 * Оба изменения сохраняются через `updateUser` из entities/user; если не получилось — откатить.
 * @param targetUserId кого лайкаем
 */

/**
 * Меняет лайк текущего пользователя и счётчик адресата.
 * Если сохранение второй записи не удалось, восстанавливает первую.
 */
export const toggleFavorite = createAsyncThunk<
  void,
  string,
  { state: RootState; rejectValue: string }
>(
  'favoriteToggle/toggle',
  async (targetUserId, { dispatch, getState, rejectWithValue }) => {
    const state = getState()
    const currentUser = selectCurrentUser(state)
    const targetUser = selectUserById(state, targetUserId)

    if (!currentUser || !targetUser || currentUser.id === targetUserId) return

    const alreadyLiked = currentUser.likedUserIds.includes(targetUserId)
    const nextLikedUserIds = alreadyLiked
      ? currentUser.likedUserIds.filter((id) => id !== targetUserId)
      : [...currentUser.likedUserIds, targetUserId]
    const likesDelta = alreadyLiked ? -1 : 1

    try {
      await dispatch(
        updateDataUser({
          id: currentUser.id,
          changes: { likedUserIds: nextLikedUserIds },
        }),
      ).unwrap()
    } catch (error) {
      return rejectWithValue(getSaveError(error))
    }

    try {
      await dispatch(
        updateDataUser({
          id: targetUser.id,
          changes: { likesCount: Math.max(0, targetUser.likesCount + likesDelta) },
        }),
      ).unwrap()
    } catch (error) {
      try {
        await dispatch(
          updateDataUser({
            id: currentUser.id,
            changes: { likedUserIds: currentUser.likedUserIds },
          }),
        ).unwrap()
      } catch {
        return rejectWithValue(DATA_ERRORS.SAVE_USER)
      }

      return rejectWithValue(getSaveError(error))
    }
  },
  {
    condition: (targetUserId, { getState }) => {
      const state = getState()
      const currentUser = selectCurrentUser(state)
      return (
        !state.favoriteToggle.isPending &&
        !!currentUser &&
        currentUser.id !== targetUserId &&
        !!selectUserById(state, targetUserId)
      )
    },
  },
)
