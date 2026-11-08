import { createUser } from '../testing'
import { describe, test, expect } from 'vitest'
import {
  selectUserById,
  selectUserByEmail,
  selectPopularUsers,
  selectNewUsers,
  selectRecomendUsers,
} from './selectors'

const makeState = (items: ReturnType<typeof createUser>[]): RootState =>
  ({
    users: {
      items,
      status: 'idle',
      error: null,
    },
  }) as RootState

describe('Тестирование селекторов пользователей', () => {
  describe('selectUserById', () => {
    test('находит пользователя по id', () => {
      const user = createUser({ id: 'u1' })
      const state = makeState([user])

      const result = selectUserById(state, 'u1')

      expect(result).toBeDefined()
      expect(result?.id).toBe('u1')
    })

    test('возвращает PublicUser без поля password', () => {
      const user = createUser({ id: 'u1' })
      const state = makeState([user])

      const result = selectUserById(state, 'u1')

      expect(result).not.toHaveProperty('password')
    })

    test('возвращает undefined, если пользователь не найден', () => {
      const state = makeState([])

      expect(selectUserById(state, 'u999')).toBeUndefined()
    })
  })

  describe('selectUserByEmail', () => {
    test('находит пользователя по email', () => {
      const user = createUser({ id: 'u1', email: 'test@example.com' })
      const state = makeState([user])

      const result = selectUserByEmail(state, 'test@example.com')

      expect(result).toBeDefined()
      expect(result?.id).toBe('u1')
    })

    test('возвращает PublicUser без поля password', () => {
      const user = createUser({ id: 'u1', email: 'test@example.com' })
      const state = makeState([user])

      const result = selectUserByEmail(state, 'test@example.com')

      expect(result).not.toHaveProperty('password')
    })

    test('возвращает undefined, если email не найден', () => {
      const state = makeState([])

      expect(selectUserByEmail(state, 'nope@example.com')).toBeUndefined()
    })
  })

  describe('selectPopularUsers', () => {
    test('сортирует пользователей по likesCount по убыванию', () => {
      const user1 = createUser({ id: 'u1', likesCount: 10 })
      const user2 = createUser({ id: 'u2', likesCount: 100 })
      const user3 = createUser({ id: 'u3', likesCount: 50 })
      const state = makeState([user1, user2, user3])

      const result = selectPopularUsers(state)

      expect(result[0].id).toBe('u2')
      expect(result[1].id).toBe('u3')
      expect(result[2].id).toBe('u1')
    })

    test('возвращает PublicUser[] без паролей', () => {
      const users = [createUser({ id: 'u1' }), createUser({ id: 'u2' })]
      const state = makeState(users)

      const result = selectPopularUsers(state)

      result.forEach((user) => {
        expect(user).not.toHaveProperty('password')
      })
    })

    test('возвращает пустой массив для пустого state', () => {
      const state = makeState([])

      expect(selectPopularUsers(state)).toEqual([])
    })
  })

  describe('selectNewUsers', () => {
    test('сортирует пользователей по createdAt по убыванию', () => {
      const user1 = createUser({ id: 'u1', createdAt: '2026-01-01T00:00:00.000Z' })
      const user2 = createUser({ id: 'u2', createdAt: '2026-11-01T00:00:00.000Z' })
      const user3 = createUser({ id: 'u3', createdAt: '2026-06-01T00:00:00.000Z' })
      const state = makeState([user1, user2, user3])

      const result = selectNewUsers(state)

      expect(result[0].id).toBe('u2')
      expect(result[1].id).toBe('u3')
      expect(result[2].id).toBe('u1')
    })

    test('возвращает PublicUser[] без паролей', () => {
      const users = [createUser({ id: 'u1' }), createUser({ id: 'u2' })]
      const state = makeState(users)

      const result = selectNewUsers(state)

      result.forEach((user) => {
        expect(user).not.toHaveProperty('password')
      })
    })
  })

  describe('selectRecomendUsers', () => {
    test('возвращает массив того же размера', () => {
      const users = [createUser({ id: 'u1' }), createUser({ id: 'u2' }), createUser({ id: 'u3' })]
      const state = makeState(users)

      const result = selectRecomendUsers(state)

      expect(result).toHaveLength(users.length)
    })

    test('содержит все исходные id', () => {
      const users = [createUser({ id: 'u1' }), createUser({ id: 'u2' }), createUser({ id: 'u3' })]
      const state = makeState(users)

      const result = selectRecomendUsers(state)
      const resultIds = result.map((u) => u.id).sort()

      expect(resultIds).toEqual(['u1', 'u2', 'u3'])
    })

    test('возвращает PublicUser[] без паролей', () => {
      const users = [createUser({ id: 'u1' }), createUser({ id: 'u2' })]
      const state = makeState(users)

      const result = selectRecomendUsers(state)

      result.forEach((user) => {
        expect(user).not.toHaveProperty('password')
      })
    })

    test('возвращает стабильный порядок при повторных вызовах (мемоизация)', () => {
      const users = [
        createUser({ id: 'u1' }),
        createUser({ id: 'u2' }),
        createUser({ id: 'u3' }),
        createUser({ id: 'u4' }),
      ]
      const state = makeState(users)

      const result1 = selectRecomendUsers(state)
      const result2 = selectRecomendUsers(state)

      expect(result1.map((u) => u.id)).toEqual(result2.map((u) => u.id))
    })
  })
})
