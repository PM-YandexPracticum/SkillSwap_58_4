import { configureStore } from '@reduxjs/toolkit'
import { DATA_ERRORS, MOCK_DB } from '@/shared/config'
import { createUser } from '../testing'
import { fetchUsers, usersReducer, type UsersState } from '..'
import { selectRecommendedUsers } from './selectors'

const initial: UsersState = { items: [], status: 'idle', error: null }
const user = createUser()

afterEach(() => vi.restoreAllMocks())

describe('usersSlice', () => {
  it('начальное состояние — idle без данных и ошибки', () => {
    expect(usersReducer(undefined, { type: 'unknown' })).toEqual(initial)
  })

  it('pending сбрасывает ошибку и сохраняет ранее загруженные данные', () => {
    const state = usersReducer(
      { items: [user], status: 'failed', error: DATA_ERRORS.LOAD_USERS },
      fetchUsers.pending('req'),
    )

    expect(state).toEqual({ items: [user], status: 'loading', error: null })
  })

  it('fulfilled заменяет данные и очищает ошибку', () => {
    const state = usersReducer(
      { items: [], status: 'loading', error: DATA_ERRORS.LOAD_USERS },
      fetchUsers.fulfilled([user], 'req'),
    )

    expect(state).toEqual({ items: [user], status: 'succeeded', error: null })
  })

  it('rejected сохраняет данные и сообщает понятную ошибку', () => {
    const state = usersReducer(
      { items: [user], status: 'loading', error: null },
      fetchUsers.rejected(new Error('technical details'), 'req'),
    )

    expect(state).toEqual({ items: [user], status: 'failed', error: DATA_ERRORS.LOAD_USERS })
  })

  it('повторная загрузка после ошибки проходит полный цикл состояний', () => {
    const failed = usersReducer(initial, fetchUsers.rejected(new Error('failed'), 'first'))
    const loading = usersReducer(failed, fetchUsers.pending('retry'))
    const loaded = usersReducer(loading, fetchUsers.fulfilled([], 'retry'))

    expect(loading).toEqual({ items: [], status: 'loading', error: null })
    expect(loaded).toEqual({ items: [], status: 'succeeded', error: null })
  })

  it('передаёт реальную ошибку загрузки в failed и позволяет повторить запрос', async () => {
    // Новый загрузчик без кеша public/db: тест не зависит от порядка остальных тестов.
    vi.resetModules()
    const { fetchUsers, usersReducer } = await import('..')
    const store = configureStore({ reducer: { users: usersReducer } })
    const fetch = vi.spyOn(globalThis, 'fetch').mockRejectedValueOnce(new Error('network details'))

    const failed = await store.dispatch(fetchUsers())

    expect(fetchUsers.rejected.match(failed)).toBe(true)
    expect(store.getState().users).toEqual({
      items: [],
      status: 'failed',
      error: DATA_ERRORS.LOAD_USERS,
    })
    fetch.mockRestore()

    await store.dispatch(fetchUsers()).unwrap()

    expect(store.getState().users.status).toBe('succeeded')
    expect(store.getState().users.error).toBeNull()
  })

  it('загружает всех пользователей public/db и перемешивает один раз до сохранения в store', async () => {
    const { default: users } = await import('../../../../public/db/users.json')
    const random = vi.spyOn(Math, 'random').mockReturnValue(0)
    const store = configureStore({ reducer: { users: usersReducer } })

    await store.dispatch(fetchUsers()).unwrap()

    const state = store.getState().users
    expect(state.status).toBe('succeeded')
    expect(state.error).toBeNull()
    expect(state.items).toEqual([...users.slice(1), users[0]])
    const callsAfterLoad = random.mock.calls.length
    const rootState = store.getState() as RootState
    expect(selectRecommendedUsers(rootState).map((item) => item.id)).toEqual(
      state.items.map((item) => item.id),
    )
    selectRecommendedUsers({ ...rootState })
    expect(random).toHaveBeenCalledTimes(callsAfterLoad)
  })

  it('загружает сохранённую коллекцию localStorage, включая пустую', async () => {
    localStorage.setItem(`${MOCK_DB.STORAGE_PREFIX}users`, '[]')
    const store = configureStore({ reducer: { users: usersReducer } })

    await store.dispatch(fetchUsers()).unwrap()

    expect(store.getState().users).toEqual({ items: [], status: 'succeeded', error: null })
  })
})
