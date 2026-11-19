import { createTestStore } from '@/app/test/createTestStore'
import { createSkill } from '@/entities/skill/testing'
import { createUser } from '@/entities/user/testing'
import type { User } from '@/entities/user'
import { selectSimilarUsers } from './selectSimilarUsers'

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
