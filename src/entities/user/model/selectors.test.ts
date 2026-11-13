import { createTestStore } from '@/app/test/createTestStore'
import { createUser } from '../testing'
import {
  selectUsers,
  selectUsersStatus,
  selectUsersSaveStatus,
  selectUsersSaveError,
  selectUserById,
  selectUserByEmail,
  selectPopularUsers,
  selectNewUsers,
  selectRecommendedUsers,
} from '..'
import type { User } from './types'

const makeState = (items: User[]): RootState =>
  createTestStore({
    users: {
      saveStatus: 'idle' as const,
      pendingSaves: 0,
      saveError: null,
      items,
      status: 'idle',
      error: null,
    },
  }).getState()

describe('Тестирование селекторов пользователей', () => {
  it('возвращает статус загрузки', () => {
    const state = makeState([])
    expect(selectUsersStatus({ ...state, users: { ...state.users, status: 'failed' } })).toBe(
      'failed',
    )
  })

  it('общий публичный селектор не отдаёт пароли и сохраняет ссылку при неизменных пользователях', () => {
    const state = makeState([createUser({ id: 'u1' })])
    const users = selectUsers(state)

    expect(users[0]).not.toHaveProperty('password')
    expect(selectUsers(state)).toBe(users)
    expect(selectUsers({ ...state })).toBe(users)
  })

  describe('selectUserById', () => {
    it('находит пользователя по id', () => {
      const user = createUser({ id: 'u1' })
      const state = makeState([user])

      const result = selectUserById(state, 'u1')

      expect(result).toBeDefined()
      expect(result?.id).toBe('u1')
    })

    it('возвращает PublicUser без поля password', () => {
      const user = createUser({ id: 'u1' })
      const state = makeState([user])

      const result = selectUserById(state, 'u1')

      expect(result).not.toHaveProperty('password')
      expect(selectUserById(state, 'u1')).toBe(result)
    })

    it('возвращает undefined, если пользователь не найден', () => {
      const state = makeState([])

      expect(selectUserById(state, 'u999')).toBeUndefined()
    })
  })

  describe('selectUserByEmail', () => {
    it('находит пользователя по email', () => {
      const user = createUser({ id: 'u1', email: 'test@example.com' })
      const state = makeState([user])

      const result = selectUserByEmail(state, 'test@example.com')

      expect(result).toBeDefined()
      expect(result?.id).toBe('u1')
    })

    it('возвращает исходного пользователя для проверки пароля в логике входа', () => {
      const user = createUser({ id: 'u1', email: 'test@example.com' })
      const state = makeState([user])

      const result = selectUserByEmail(state, 'test@example.com')

      expect(result).toBe(user)
      expect(result?.password).toBe(user.password)
    })

    it('возвращает undefined, если email не найден', () => {
      const state = makeState([])

      expect(selectUserByEmail(state, 'nope@example.com')).toBeUndefined()
    })

    it('находит email без учёта регистра и краевых пробелов', () => {
      const state = makeState([createUser({ id: 'u1', email: 'Test@Example.com' })])

      expect(selectUserByEmail(state, '  TEST@example.COM ')).toBe(state.users.items[0])
    })

    it.each(['', ' ', 'unknown@example.com'])('не находит отсутствующий email «%s»', (email) => {
      const state = makeState([createUser()])
      expect(selectUserByEmail(state, email)).toBeUndefined()
    })
  })

  describe('selectPopularUsers', () => {
    it('сортирует пользователей по likesCount по убыванию', () => {
      const user1 = createUser({ id: 'u1', likesCount: 10 })
      const user2 = createUser({ id: 'u2', likesCount: 100 })
      const user3 = createUser({ id: 'u3', likesCount: 50 })
      const state = makeState([user1, user2, user3])

      const result = selectPopularUsers(state)

      expect(result[0].id).toBe('u2')
      expect(result[1].id).toBe('u3')
      expect(result[2].id).toBe('u1')
    })

    it('возвращает PublicUser[] без паролей', () => {
      const users = [createUser({ id: 'u1' }), createUser({ id: 'u2' })]
      const state = makeState(users)

      const result = selectPopularUsers(state)

      result.forEach((user) => {
        expect(user).not.toHaveProperty('password')
      })
    })

    it('возвращает пустой массив для пустого state', () => {
      const state = makeState([])

      expect(selectPopularUsers(state)).toEqual([])
    })
  })

  describe('selectNewUsers', () => {
    it('сортирует пользователей по createdAt по убыванию', () => {
      const user1 = createUser({ id: 'u1', createdAt: '2026-01-01T00:00:00.000Z' })
      const user2 = createUser({ id: 'u2', createdAt: '2026-11-01T00:00:00.000Z' })
      const user3 = createUser({ id: 'u3', createdAt: '2026-06-01T00:00:00.000Z' })
      const state = makeState([user1, user2, user3])

      const result = selectNewUsers(state)

      expect(result[0].id).toBe('u2')
      expect(result[1].id).toBe('u3')
      expect(result[2].id).toBe('u1')
    })

    it('возвращает PublicUser[] без паролей', () => {
      const users = [createUser({ id: 'u1' }), createUser({ id: 'u2' })]
      const state = makeState(users)

      const result = selectNewUsers(state)

      result.forEach((user) => {
        expect(user).not.toHaveProperty('password')
      })
    })
  })

  describe('selectRecommendedUsers', () => {
    it('возвращает массив того же размера', () => {
      const users = [createUser({ id: 'u1' }), createUser({ id: 'u2' }), createUser({ id: 'u3' })]
      const state = makeState(users)

      const result = selectRecommendedUsers(state)

      expect(result).toHaveLength(users.length)
    })

    it('содержит все исходные id', () => {
      const users = [createUser({ id: 'u1' }), createUser({ id: 'u2' }), createUser({ id: 'u3' })]
      const state = makeState(users)

      const result = selectRecommendedUsers(state)
      const resultIds = result.map((u) => u.id).sort()

      expect(resultIds).toEqual(['u1', 'u2', 'u3'])
    })

    it('возвращает PublicUser[] без паролей', () => {
      const users = [createUser({ id: 'u1' }), createUser({ id: 'u2' })]
      const state = makeState(users)

      const result = selectRecommendedUsers(state)

      result.forEach((user) => {
        expect(user).not.toHaveProperty('password')
      })
    })

    it('возвращает стабильный порядок при повторных вызовах (мемоизация)', () => {
      const users = [
        createUser({ id: 'u1' }),
        createUser({ id: 'u2' }),
        createUser({ id: 'u3' }),
        createUser({ id: 'u4' }),
      ]
      const state = makeState(users)

      const result1 = selectRecommendedUsers(state)
      const result2 = selectRecommendedUsers(state)

      expect(result2).toBe(result1)
      expect(result1.map((u) => u.id)).toEqual(result2.map((u) => u.id))
    })

    it('не меняет порядок после изменения числа лайков', () => {
      const users = ['u3', 'u1', 'u2'].map((id) => createUser({ id }))
      const before = selectRecommendedUsers(makeState(users))
      const after = selectRecommendedUsers(
        makeState(users.map((user) => (user.id === 'u1' ? { ...user, likesCount: 100 } : user))),
      )

      expect(after.map((user) => user.id)).toEqual(before.map((user) => user.id))
      expect(after.find((user) => user.id === 'u1')?.likesCount).toBe(100)
    })
  })

  it.each([
    ['selectUsers', selectUsers],
    ['selectPopularUsers', selectPopularUsers],
    ['selectNewUsers', selectNewUsers],
    ['selectRecommendedUsers', selectRecommendedUsers],
  ] as const)('%s возвращает стабильный пустой список', (_name, select) => {
    const state = makeState([])
    expect(select(state)).toEqual([])
    expect(select({ ...state })).toBe(select(state))
  })

  it.each([
    ['selectPopularUsers', selectPopularUsers],
    ['selectNewUsers', selectNewUsers],
  ] as const)('%s сохраняет порядок при равных значениях и не меняет store', (_name, select) => {
    const users = ['u3', 'u1', 'u2'].map((id) => createUser({ id }))
    const state = makeState(users)
    Object.freeze(users)
    users.forEach(Object.freeze)

    expect(select(state).map((user) => user.id)).toEqual(['u3', 'u1', 'u2'])
    expect(select({ ...state })).toBe(select(state))
    expect(state.users.items).toBe(users)
  })

  it('сортировки секций не переставляют публичный список и рекомендации', () => {
    const state = makeState([
      createUser({ id: 'u1', likesCount: 1, createdAt: '2026-01-01T00:00:00Z' }),
      createUser({ id: 'u2', likesCount: 3, createdAt: '2026-02-01T00:00:00Z' }),
      createUser({ id: 'u3', likesCount: 2, createdAt: '2026-03-01T00:00:00Z' }),
    ])
    const users = selectUsers(state)

    expect(selectPopularUsers(state).map((user) => user.id)).toEqual(['u2', 'u3', 'u1'])
    expect(selectNewUsers(state).map((user) => user.id)).toEqual(['u3', 'u2', 'u1'])
    expect(selectRecommendedUsers(state).map((user) => user.id)).toEqual(['u1', 'u2', 'u3'])
    expect(selectUsers(state)).toBe(users)
    expect(state.users.items.map((user) => user.id)).toEqual(['u1', 'u2', 'u3'])
  })
})

describe('селекторы состояния сохранения', () => {
  it('возвращают состояние записи независимо от стартовой загрузки', () => {
    const state = makeState([])
    const saving = {
      ...state,
      users: { ...state.users, saveStatus: 'failed' as const, saveError: 'Не удалось сохранить' },
    }
    expect(selectUsersSaveStatus(saving)).toBe('failed')
    expect(selectUsersSaveError(saving)).toBe('Не удалось сохранить')
    expect(selectUsersStatus(saving)).toBe('idle')
  })
})
