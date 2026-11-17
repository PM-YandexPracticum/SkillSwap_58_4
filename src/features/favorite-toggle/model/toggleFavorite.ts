import { createAsyncThunk } from '@reduxjs/toolkit'

import { selectCurrentUser, selectUserById, updateUserFavorite } from '@/entities/user'
import { DATA_ERRORS } from '@/shared/config'
import { selectFavoriteTogglePending } from './selectors'

/**
 * Переключает лайк через атомарную операцию entities/user: избранное и счётчик
 * появляются в store только после общего сохранения. Ошибка не требует отката.
 * Запущенная операция завершается для исходного пользователя даже после выхода;
 * устаревший ответ не должен показывать ошибку в UI новой сессии.
 */
export const toggleFavorite = createAsyncThunk<
  void,
  string,
  { state: RootState; rejectValue: string }
>(
  'favoriteToggle/toggle',
  async (targetUserId, { dispatch, getState, rejectWithValue }) => {
    const currentUser = selectCurrentUser(getState())
    if (!currentUser) return
    try {
      await dispatch(updateUserFavorite({ currentUserId: currentUser.id, targetUserId })).unwrap()
    } catch (error) {
      return rejectWithValue(typeof error === 'string' ? error : DATA_ERRORS.SAVE_USER)
    }
  },
  {
    condition: (targetUserId, { getState }) => {
      const state = getState()
      const currentUser = selectCurrentUser(state)
      return (
        !selectFavoriteTogglePending(state, targetUserId) &&
        !!currentUser &&
        currentUser.id !== targetUserId &&
        !!selectUserById(state, targetUserId)
      )
    },
  },
)
