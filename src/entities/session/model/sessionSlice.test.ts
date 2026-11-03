import { configureStore } from '@reduxjs/toolkit'

import { STORAGE_KEYS } from '@/shared/config'

import { saveSession } from '../lib/sessionStorage'

import { selectIsAuth, selectSession } from './selectors'
import { endSession, sessionReducer, startSession } from './sessionSlice'

/** Store только с сессией — как при открытии сайта: начальное состояние читается из localStorage */
const createStore = () => configureStore({ reducer: { session: sessionReducer } })

describe('sessionSlice', () => {
  it('при открытии сайта без сохранённой сессии — гость', () => {
    const store = createStore()

    expect(selectSession(store.getState() as RootState)).toBeNull()
    expect(selectIsAuth(store.getState() as RootState)).toBe(false)
  })

  it('после перезагрузки вошедший остаётся вошедшим', () => {
    saveSession('u01')

    const store = createStore()

    expect(selectSession(store.getState() as RootState)).toEqual({
      userId: 'u01',
      token: 'mock_token_u01',
    })
  })

  it('startSession: пользователь вошёл — сессия в store и в localStorage', () => {
    const store = createStore()

    const session = store.dispatch(startSession('u01'))

    expect(session).toEqual({ userId: 'u01', token: 'mock_token_u01' })
    expect(selectIsAuth(store.getState() as RootState)).toBe(true)
    expect(JSON.parse(localStorage.getItem(STORAGE_KEYS.SESSION) ?? 'null')).toEqual(session)
  })

  it('endSession: «Выйти» стирает сессию и в store, и в localStorage', () => {
    const store = createStore()
    store.dispatch(startSession('u01'))

    store.dispatch(endSession())

    expect(selectIsAuth(store.getState() as RootState)).toBe(false)
    expect(localStorage.getItem(STORAGE_KEYS.SESSION)).toBeNull()
  })

  it('после выхода и перезагрузки пользователь остаётся гостем', () => {
    const before = createStore()
    before.dispatch(startSession('u01'))
    before.dispatch(endSession())

    const after = createStore()

    expect(selectIsAuth(after.getState() as RootState)).toBe(false)
  })
})
