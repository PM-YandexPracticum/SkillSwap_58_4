import { createSlice, type Dispatch, type PayloadAction } from '@reduxjs/toolkit'

import { clearSession, loadSession, saveSession } from '../lib/sessionStorage'
import type { Session } from './types'

export interface SessionState {
  session: Session | null
}

/**
 * Состояние авторизации: кто вошёл (`userId`) или гость (`null`).
 * Начальное значение читается из localStorage при создании store — после перезагрузки вошедший остаётся вошедшим.
 * Тесты задают сессию через `preloadedState`, тогда localStorage не читается.
 */
export const sessionSlice = createSlice({
  name: 'session',
  initialState: (): SessionState => ({ session: loadSession() }),
  reducers: {
    sessionStarted: (_state, action: PayloadAction<Session>) => ({ session: action.payload }),
    sessionEnded: () => ({ session: null }),
  },
})

export const { sessionStarted, sessionEnded } = sessionSlice.actions

/**
 * Вход: сохраняет сессию в localStorage и кладёт её в store — одним действием, чтобы одно не забыли без другого.
 * Вызывает вход (P4-09) и завершение регистрации (P6-06): `dispatch(startSession(user.id))`.
 * @returns созданная сессия
 */
export const startSession =
  (userId: string) =>
  (dispatch: Dispatch): Session => {
    const session = saveSession(userId)
    dispatch(sessionStarted(session))
    return session
  }

/** Выход: стирает сессию из localStorage и из store. Вызывает «Выйти» в меню шапки (P5-09): `dispatch(endSession())` */
export const endSession = () => (dispatch: Dispatch) => {
  clearSession()
  dispatch(sessionEnded())
}

export const sessionReducer = sessionSlice.reducer
