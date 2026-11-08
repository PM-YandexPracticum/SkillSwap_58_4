import { describe, test, expect, vi, beforeEach } from 'vitest'
import { configureStore } from '@reduxjs/toolkit'
import { fetchUsers, usersReducer } from './usersSlice'
import * as userApi from '../api/userApi'

const makeStore = () =>
  configureStore({
    reducer: {
      users: usersReducer,
    },
  })

describe('fetchUsers thunk', () => {
  let store: ReturnType<typeof makeStore>

  beforeEach(() => {
    store = makeStore()
  })

  test('успешная загрузка пользователей (fulfilled)', async () => {
    await store.dispatch(fetchUsers())

    const state = store.getState().users

    expect(state.status).toBe('succeeded')
    expect(state.items.length).toBeGreaterThan(0)
    expect(state.error).toBeNull()
  })

  test('начальное состояние idle', () => {
    const state = store.getState().users

    expect(state.status).toBe('idle')
    expect(state.items).toEqual([])
    expect(state.error).toBeNull()
  })

  test('ошибка загрузки (rejected)', async () => {
    vi.spyOn(userApi, 'getUsers').mockRejectedValueOnce(new Error('Network error'))

    await store.dispatch(fetchUsers())

    const state = store.getState().users

    expect(state.status).toBe('failed')
    expect(state.error).toBe('Ошибка загрузки пользователей')
    expect(state.items).toEqual([])
  })
})
