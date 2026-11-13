import { configureStore } from '@reduxjs/toolkit'
import { DATA_ERRORS } from '@/shared/config'
import { createUser } from '../testing'
import {
  fetchUsers,
  usersReducer,
  createNewUser,
  updateDataUser,
  getUsers,
  createUser as persistUser,
} from '..'

afterEach(() => vi.restoreAllMocks())

const makeStore = () => configureStore({ reducer: { users: usersReducer } })

describe('сохранение пользователей (P4-06)', () => {
  it('сохраняет нового пользователя и читает его после создания нового store', async () => {
    const store = makeStore()
    const user = createUser()
    await store.dispatch(fetchUsers()).unwrap()
    const previous = store.getState().users
    const writing = store.dispatch(createNewUser(user))
    expect(store.getState().users.status).toBe('succeeded')
    expect(store.getState().users.saveStatus).toBe('loading')
    await writing.unwrap()
    expect(previous.items).not.toContainEqual(user)
    expect(store.getState().users.items.at(-1)).toEqual(user)
    const reloaded = makeStore()
    await reloaded.dispatch(fetchUsers()).unwrap()
    expect(reloaded.getState().users.items).toContainEqual(user)
  })

  it('меняет профиль и лайки, сохраняя порядок и прежние объекты', async () => {
    const store = makeStore()
    await store.dispatch(fetchUsers()).unwrap()
    const previous = store.getState().users.items
    const user = previous[1]
    const changes = {
      name: 'Новое имя',
      likedUserIds: ['another'],
      likesCount: user.likesCount + 1,
    }
    const updated = await store.dispatch(updateDataUser({ id: user.id, changes })).unwrap()
    expect(store.getState().users.items.map((item) => item.id)).toEqual(
      previous.map((item) => item.id),
    )
    expect(previous[1]).toBe(user)
    expect(previous[1].name).not.toBe(changes.name)
    expect(store.getState().users.items[1]).toEqual(updated)
    expect((await getUsers()).find((item) => item.id === user.id)).toEqual(updated)
  })

  it('отклоняет повтор email независимо от регистра, пробелов и актуальности store', async () => {
    const store = makeStore()
    await store.dispatch(fetchUsers()).unwrap()
    await persistUser(createUser({ id: 'external' }))
    const result = await store.dispatch(
      createNewUser(createUser({ id: 'duplicate', email: ' TEST@EXAMPLE.COM ' })),
    )
    expect(result).toMatchObject({
      type: createNewUser.rejected.type,
      payload: DATA_ERRORS.DUPLICATE_EMAIL,
    })
    expect(store.getState().users.status).toBe('succeeded')
    expect(store.getState().users.saveStatus).toBe('failed')
    expect(store.getState().users.saveError).toBe(DATA_ERRORS.DUPLICATE_EMAIL)
    expect(
      (await getUsers()).filter((item) => ['external', 'duplicate'].includes(item.id)),
    ).toHaveLength(1)
  })

  it('не принимает два параллельных создания с одним email', async () => {
    const store = makeStore()
    const results = await Promise.all([
      store.dispatch(createNewUser(createUser({ id: 'one' }))),
      store.dispatch(createNewUser(createUser({ id: 'two', email: 'TEST@example.com' }))),
    ])
    expect(results.filter(createNewUser.fulfilled.match)).toHaveLength(1)
    expect(results.filter(createNewUser.rejected.match)).toHaveLength(1)
    expect(store.getState().users.items).toHaveLength(1)
    expect(store.getState().users.status).toBe('idle')
    expect(store.getState().users.pendingSaves).toBe(0)
    expect(store.getState().users.saveError).toBe(DATA_ERRORS.DUPLICATE_EMAIL)
  })

  it('при нехватке места оставляет данные и стартовый статус, повтор сохранения очищает ошибку', async () => {
    const store = makeStore()
    await store.dispatch(fetchUsers()).unwrap()
    const previous = store.getState().users.items
    const user = previous[0]
    const storage = vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {
      throw new DOMException('quota details', 'QuotaExceededError')
    })
    const result = await store.dispatch(
      updateDataUser({ id: user.id, changes: { name: 'Новое имя' } }),
    )
    expect(result).toMatchObject({
      type: updateDataUser.rejected.type,
      payload: DATA_ERRORS.STORAGE_FULL,
    })
    expect(store.getState().users).toMatchObject({
      status: 'succeeded',
      saveStatus: 'failed',
      saveError: DATA_ERRORS.STORAGE_FULL,
      error: null,
      items: previous,
    })
    expect(await getUsers()).toEqual(expect.arrayContaining(previous))
    storage.mockRestore()
    await store.dispatch(updateDataUser({ id: user.id, changes: { name: 'Новое имя' } })).unwrap()
    expect(store.getState().users).toMatchObject({
      saveStatus: 'succeeded',
      saveError: null,
      pendingSaves: 0,
    })
  })

  it('заменяет техническую ошибку понятным сообщением', async () => {
    const store = makeStore()
    const result = await store.dispatch(updateDataUser({ id: 'missing', changes: { name: 'Имя' } }))
    expect(result).toMatchObject({
      type: updateDataUser.rejected.type,
      payload: DATA_ERRORS.SAVE_USER,
    })
    expect(store.getState().users.items).toEqual([])
  })

  it('статус остаётся loading до завершения всех записей и сохраняет ошибку всей группы', () => {
    let state = usersReducer(undefined, createNewUser.pending('first', createUser()))
    state = usersReducer(state, updateDataUser.pending('second', { id: 'u-test', changes: {} }))
    state = usersReducer(
      state,
      createNewUser.rejected(new Error('failure'), 'first', createUser(), DATA_ERRORS.SAVE_USER),
    )
    expect(state).toMatchObject({
      saveStatus: 'loading',
      pendingSaves: 1,
      saveError: DATA_ERRORS.SAVE_USER,
    })
    state = usersReducer(
      state,
      updateDataUser.fulfilled(createUser(), 'second', { id: 'u-test', changes: {} }),
    )
    expect(state).toMatchObject({
      saveStatus: 'failed',
      pendingSaves: 0,
      saveError: DATA_ERRORS.SAVE_USER,
      status: 'idle',
    })
  })

  it('загрузка не сбрасывает ошибку сохранения и сохранение не сбрасывает ошибку загрузки', () => {
    const failed = usersReducer(undefined, fetchUsers.rejected(new Error('load'), 'load'))
    const saved = usersReducer(failed, createNewUser.fulfilled(createUser(), 'write', createUser()))
    expect(saved).toMatchObject({ status: 'failed', error: DATA_ERRORS.LOAD_USERS })
    const failedSave = usersReducer(
      saved,
      createNewUser.rejected(new Error('save'), 'next', createUser(), DATA_ERRORS.SAVE_USER),
    )
    const loaded = usersReducer(failedSave, fetchUsers.fulfilled([], 'reload'))
    expect(loaded).toMatchObject({
      status: 'succeeded',
      error: null,
      saveError: DATA_ERRORS.SAVE_USER,
    })
  })
})

describe('согласование сохранённых пользователей с загрузкой', () => {
  it('обновление отсутствующей в store записи добавляет её и сохраняется после перезагрузки', async () => {
    const store = makeStore()
    await persistUser(createUser())
    const saved = await store
      .dispatch(updateDataUser({ id: 'u-test', changes: { name: 'Новое имя' } }))
      .unwrap()
    expect(store.getState().users.items).toEqual([saved])
    const reloaded = makeStore()
    await reloaded.dispatch(fetchUsers()).unwrap()
    expect(reloaded.getState().users.items).toContainEqual(saved)
  })

  it.each(['load-first', 'save-first'])(
    'параллельная загрузка и создание (%s) не дублируют запись',
    async (order) => {
      const store = makeStore()
      const user = createUser()
      const load = () => store.dispatch(fetchUsers()).unwrap()
      const save = () => store.dispatch(createNewUser(user)).unwrap()
      await Promise.all(order === 'load-first' ? [load(), save()] : [save(), load()])
      expect(store.getState().users.items.filter((item) => item.id === user.id)).toEqual([user])
    },
  )

  it('повтор id отклоняется понятной ошибкой и не меняет существующий список', async () => {
    const store = makeStore()
    await store.dispatch(createNewUser(createUser())).unwrap()
    const previous = store.getState().users.items
    const result = await store.dispatch(createNewUser(createUser({ email: 'other@example.com' })))
    expect(result).toMatchObject({
      type: createNewUser.rejected.type,
      payload: DATA_ERRORS.SAVE_USER,
    })
    expect(store.getState().users.items).toBe(previous)
  })
})
