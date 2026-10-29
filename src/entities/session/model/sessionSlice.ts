import { createSlice } from '@reduxjs/toolkit'
import type { Session } from './types'

export interface SessionState {
  session: Session | null
}

const initialState: SessionState = {
  session: null,
}

/**
 * Состояние авторизации.
 * TODO: setSession(session), clearSession(); начальное значение читать из sessionStorage.ts
 */
export const sessionSlice = createSlice({
  name: 'session',
  initialState,
  reducers: {},
})

export const sessionReducer = sessionSlice.reducer
