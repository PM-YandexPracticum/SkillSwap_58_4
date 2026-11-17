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
    expect(store.getState().favoriteToggle.isPending).toBe(true)
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

  it('откатывает первую запись в store и базе, если сохранение счётчика не удалось', async () => {
    const { store, currentUser, targetUser } = await setup()
    const originalSetItem = Storage.prototype.setItem
    let writeCount = 0
    vi.spyOn(Storage.prototype, 'setItem').mockImplementation((key, value) => {
      writeCount += 1
      if (writeCount === 2) throw new DOMException('quota', 'QuotaExceededError')
      return originalSetItem.call(localStorage, key, value)
    })

    const result = await store.dispatch(toggleFavorite(targetUserId))

    expect(toggleFavorite.rejected.match(result)).toBe(true)
    if (toggleFavorite.rejected.match(result)) {
      expect(result.payload).toBe(DATA_ERRORS.STORAGE_FULL)
    }
    expect(store.getState().users.items).toEqual(expect.arrayContaining([currentUser, targetUser]))
    expect(await getUsers()).toEqual(expect.arrayContaining([currentUser, targetUser]))
  })
})
