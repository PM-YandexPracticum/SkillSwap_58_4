import { createTestStore } from '@/app/test/createTestStore'
import { createSkill } from '@/entities/skill/testing'
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
  selectSimilarUsers,
} from '..'
import type { User } from './types'

const makeState = (items: User[], skills: ReturnType<typeof createSkill>[] = []): RootState =>
  createTestStore({
    users: {
      saveStatus: 'idle' as const,
      pendingSaves: 0,
      saveError: null,
      items,
      status: 'idle',
      error: null,
    },
    skills: {
      saveStatus: 'idle' as const,
      pendingSaves: 0,
      saveError: null,
      items: skills,
      status: 'idle',
      error: null,
    },
  }).getState()

describe('selectSimilarUsers', () => {
  const author = createUser({ id: 'author', teachSkillId: 'current' })
  const similar = createUser({ id: 'similar', teachSkillId: 'similar-skill' })
  const other = createUser({
    id: 'other',
    teachSkillId: 'other-skill',
    learnSubcategoryIds: ['music'],
  })
  const currentSkill = createSkill({
    id: 'current',
    authorId: author.id,
    categoryId: 'creativity',
    subcategoryId: 'music',
  })
  const similarSkill = createSkill({ ...currentSkill, id: 'similar-skill', authorId: similar.id })
  const otherSkill = createSkill({
    ...currentSkill,
    id: 'other-skill',
    authorId: other.id,
    subcategoryId: 'photo',
  })
  const users = [author, similar, other]
  const skills = [currentSkill, similarSkill, otherSkill]

  it('выбирает других авторов той же подкатегории, а не категории или желаний учиться', () => {
    const result = selectSimilarUsers(makeState(users, skills), currentSkill.id)

    expect(result.map((user) => user.id)).toEqual([similar.id])
  })

  it('возвращает публичные данные без пароля', () => {
    const result = selectSimilarUsers(makeState(users, skills), currentSkill.id)

    expect(result[0]).not.toHaveProperty('password')
    expect(result[0].name).toBe(similar.name)
  })

  it('пропускает отсутствующий навык и ссылку на чужое предложение', () => {
    const state = makeState(
      [
        ...users,
        createUser({ id: 'missing', teachSkillId: 'missing' }),
        createUser({ id: 'wrong-author', teachSkillId: similarSkill.id }),
      ],
      skills,
    )

    expect(selectSimilarUsers(state, currentSkill.id).map((user) => user.id)).toEqual([similar.id])
  })

  it.each(['', 'unknown'])('без текущего навыка «%s» возвращает пустой список', (skillId) => {
    expect(selectSimilarUsers(makeState(users, skills), skillId)).toEqual([])
  })

  it('не считает отсутствующие подкатегории совпадением', () => {
    const state = makeState(
      users,
      skills.map((skill) => ({ ...skill, subcategoryId: '' })),
    )

    expect(selectSimilarUsers(state, currentSkill.id)).toEqual([])
  })

  it.each([
    ['без пользователей', [], skills],
    ['без навыков', users, []],
    ['без похожих', [author, other], [currentSkill, otherSkill]],
    ['без автора похожего предложения', [author], skills],
  ] as const)('%s возвращает пустой список', (_name, records, offers) => {
    expect(selectSimilarUsers(makeState([...records], [...offers]), currentSkill.id)).toEqual([])
  })

  it('сохраняет порядок пользователей и не меняет исходные данные', () => {
    const another = createUser({ id: 'another', teachSkillId: 'another-skill' })
    const state = makeState(
      [another, author, similar],
      [...skills, createSkill({ ...similarSkill, id: another.teachSkillId, authorId: another.id })],
    )
    const originalUsers = state.users.items
    const originalSkills = state.skills.items
    Object.freeze(originalUsers)
    Object.freeze(originalSkills)

    expect(selectSimilarUsers(state, currentSkill.id).map((user) => user.id)).toEqual([
      another.id,
      similar.id,
    ])
    expect(state.users.items).toBe(originalUsers)
    expect(state.skills.items).toBe(originalSkills)
    expect(state.users.items.map((user) => user.id)).toEqual([another.id, author.id, similar.id])
  })

  it('сохраняет ссылку при повторном вызове и изменении постороннего слайса', () => {
    const state = makeState(users, skills)
    const result = selectSimilarUsers(state, currentSkill.id)

    expect(selectSimilarUsers(state, currentSkill.id)).toBe(result)
    expect(
      selectSimilarUsers({ ...state, cities: { items: [], status: 'loading' } }, currentSkill.id),
    ).toBe(result)
  })

  it('при смене навыка исключает нового автора и подбирает его подкатегорию', () => {
    const state = makeState(users, skills)

    expect(selectSimilarUsers(state, currentSkill.id).map((user) => user.id)).toEqual([similar.id])
    expect(selectSimilarUsers(state, similarSkill.id).map((user) => user.id)).toEqual([author.id])
    expect(selectSimilarUsers(state, otherSkill.id)).toEqual([])
  })

  it('пересчитывает результат после обновления навыков', () => {
    const state = makeState(users, skills)
    expect(selectSimilarUsers(state, currentSkill.id)).toHaveLength(1)
    const updated = makeState(users, [currentSkill, { ...similarSkill, subcategoryId: 'photo' }])

    expect(selectSimilarUsers(updated, currentSkill.id)).toEqual([])
  })

  it('пересчитывает результат после удаления пользователя', () => {
    expect(selectSimilarUsers(makeState(users, skills), currentSkill.id)).toHaveLength(1)
    expect(selectSimilarUsers(makeState([author], skills), currentSkill.id)).toEqual([])
  })
})

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
