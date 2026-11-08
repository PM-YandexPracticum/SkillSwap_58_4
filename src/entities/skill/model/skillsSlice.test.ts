import { describe, test, expect, vi, beforeEach } from 'vitest'
import { configureStore } from '@reduxjs/toolkit'
import { fetchSkills, skillsReducer } from './skillsSlice'
import * as skillApi from '../api/skillApi'

const makeStore = () =>
  configureStore({
    reducer: {
      skills: skillsReducer,
    },
  })

describe('fetchSkills thunk', () => {
  let store: ReturnType<typeof makeStore>

  beforeEach(() => {
    store = makeStore()
  })

  test('успешная загрузка навыков (fulfilled)', async () => {
    await store.dispatch(fetchSkills())

    const state = store.getState().skills

    expect(state.status).toBe('succeeded')
    expect(state.items.length).toBeGreaterThan(0)
    expect(state.error).toBeNull()
  })

  test('начальное состояние idle', () => {
    const state = store.getState().skills

    expect(state.status).toBe('idle')
    expect(state.items).toEqual([])
    expect(state.error).toBeNull()
  })

  test('ошибка загрузки (rejected)', async () => {
    vi.spyOn(skillApi, 'getSkills').mockRejectedValueOnce(new Error('Network error'))

    await store.dispatch(fetchSkills())

    const state = store.getState().skills

    expect(state.status).toBe('failed')
    expect(state.error).toBe('Ошибка загрузки навыков')
    expect(state.items).toEqual([])
  })
})
