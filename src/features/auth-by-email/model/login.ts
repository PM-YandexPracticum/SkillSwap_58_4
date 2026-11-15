import { startSession } from '@/entities/session'
import { selectUserByEmail } from '@/entities/user'
import type { LoginFormValues } from './schema'

/** Проверяет пару по загруженным пользователям и сохраняет мок-сессию при совпадении. */
export const login =
  ({ email, password }: LoginFormValues) =>
  (dispatch: AppDispatch, getState: () => RootState): boolean => {
    const user = selectUserByEmail(getState(), email)
    if (!user || user.password !== password) return false

    dispatch(startSession(user.id))
    return true
  }
