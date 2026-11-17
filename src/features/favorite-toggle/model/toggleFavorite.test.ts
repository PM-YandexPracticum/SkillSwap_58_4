import { fetchUsers, createUser as saveUser, getUsers } from '@/entities/user'
import { createUser } from '@/entities/user/testing'
import { createTestStore } from '@/app/test/createTestStore'
import { DATA_ERRORS } from '@/shared/config'
import { resetMockDb } from '@/shared/api'
import { toggleFavorite } from './toggleFavorite'

const currentUserId = 'favorite-owner'
const targetUserId = 'favorite-target'

async function setup() {
  resetMockDb()
  const currentUser = createUser({ id: currentUserId, email: 'favorite-owner@example.com' })
  const targetUser = createUser({
    id: targetUserId,
    email: 'favorite-target@example.com',
    likesCount: 7,
  })
  await saveUser(currentUser)
  await saveUser(targetUser)

  const store = createTestStore({
    session: { session: { userId: currentUserId, token: 'test-token' } },
  })
  await store.dispatch(fetchUsers()).unwrap()

  return { store, currentUser, targetUser }
}

afterEach(() => {
  vi.restoreAllMocks()
  resetMockDb()
})

describe('toggleFavorite', () => {
  it('лайкает и снимает лайк, сохраняя оба поля в store и базе', async () => {
    const { store, currentUser, targetUser } = await setup()

    await store.dispatch(toggleFavorite(targetUserId)).unwrap()
    expect(
      store.getState().users.items.find((user) => user.id === currentUserId)?.likedUserIds,
    ).toEqual([targetUserId])
    expect(store.getState().users.items.find((user) => user.id === targetUserId)?.likesCount).toBe(
      8,
    )
    expect(await getUsers()).toEqual(
      expect.arrayContaining([
        { ...currentUser, likedUserIds: [targetUserId] },
        { ...targetUser, likesCount: 8 },
      ]),
    )

    await store.dispatch(toggleFavorite(targetUserId)).unwrap()
    expect(
      store.getState().users.items.find((user) => user.id === currentUserId)?.likedUserIds,
    ).toEqual([])
    expect(store.getState().users.items.find((user) => user.id === targetUserId)?.likesCount).toBe(
      7,
    )
    expect(await getUsers()).toEqual(expect.arrayContaining([currentUser, targetUser]))
  })

  it('не запускает повторную операцию, пока первая пара записей сохраняется', async () => {
    const { store } = await setup()

    const firstWrite = store.dispatch(toggleFavorite(targetUserId))
    expect(store.getState().favoriteToggle.pendingUserIds).toContain(targetUserId)
    const repeatedWrite = await store.dispatch(toggleFavorite(targetUserId))

    expect(toggleFavorite.rejected.match(repeatedWrite)).toBe(true)
    if (toggleFavorite.rejected.match(repeatedWrite)) {
      expect(repeatedWrite.meta.condition).toBe(true)
    }

    await firstWrite.unwrap()
    expect(store.getState().users.items.find((user) => user.id === targetUserId)?.likesCount).toBe(
      8,
    )
  })

  it('при постоянной ошибке хранилища не меняет ни избранное, ни счётчик; повтор безопасен', async () => {
    const { store, currentUser, targetUser } = await setup()
    const write = vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {
      throw new DOMException('quota', 'QuotaExceededError')
    })

    const result = await store.dispatch(toggleFavorite(targetUserId))
    expect(result.payload).toBe(DATA_ERRORS.STORAGE_FULL)
    expect(store.getState().users.items).toEqual(expect.arrayContaining([currentUser, targetUser]))
    expect(await getUsers()).toEqual(expect.arrayContaining([currentUser, targetUser]))

    write.mockRestore()
    await store.dispatch(toggleFavorite(targetUserId)).unwrap()
    const reloaded = createTestStore()
    await reloaded.dispatch(fetchUsers()).unwrap()
    expect(reloaded.getState().users.items).toEqual(
      expect.arrayContaining([
        { ...currentUser, likedUserIds: [targetUserId] },
        { ...targetUser, likesCount: 8 },
      ]),
    )
  })

  it('сохраняет пару пользователей одним обращением к хранилищу', async () => {
    const { store } = await setup()
    const write = vi.spyOn(Storage.prototype, 'setItem')
    await store.dispatch(toggleFavorite(targetUserId)).unwrap()
    expect(write).toHaveBeenCalledTimes(1)
  })

  it('разные сердечки сохраняются без потери избранного и блокируются независимо', async () => {
    const { store } = await setup()
    const other = createUser({
      id: 'other-target',
      email: 'other-target@example.com',
      likesCount: 0,
    })
    await saveUser(other)
    await store.dispatch(fetchUsers()).unwrap()
    const first = store.dispatch(toggleFavorite(targetUserId))
    const second = store.dispatch(toggleFavorite(other.id))
    await Promise.all([first.unwrap(), second.unwrap()])
    expect(
      store.getState().users.items.find((user) => user.id === currentUserId)?.likedUserIds,
    ).toEqual([targetUserId, other.id])
    expect(store.getState().users.items.find((user) => user.id === other.id)?.likesCount).toBe(1)
    expect(store.getState().favoriteToggle.pendingUserIds).toEqual([])
  })
})
