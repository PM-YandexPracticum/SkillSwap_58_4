import { createSkill } from '@/entities/skill/testing'
import { createUser } from '@/entities/user/testing'
import { applyFilters } from './applyFilters'
import type { CatalogFilterState } from '../model/types'

const skills = [
  createSkill({ id: 's1', title: 'Игра на барабанах', subcategoryId: 'music', authorId: 'u1' }),
  createSkill({
    id: 's2',
    title: 'Разговорный английский',
    subcategoryId: 'english',
    authorId: 'u2',
  }),
  createSkill({
    id: 's3',
    title: 'Тайм-менеджмент',
    subcategoryId: 'time-management',
    authorId: 'u3',
  }),
]

const users = [
  createUser({
    id: 'u1',
    gender: 'male',
    cityId: 'spb',
    teachSkillId: 's1',
    learnSubcategoryIds: ['english'],
    createdAt: '2026-01-03T00:00:00.000Z',
  }),
  createUser({
    id: 'u2',
    gender: 'female',
    cityId: 'kzn',
    teachSkillId: 's2',
    learnSubcategoryIds: ['music'],
    createdAt: '2026-01-02T00:00:00.000Z',
  }),
  createUser({
    id: 'u3',
    gender: null,
    cityId: 'spb',
    teachSkillId: 's3',
    learnSubcategoryIds: ['music', 'english'],
    createdAt: '2026-01-01T00:00:00.000Z',
  }),
]

const baseFilter: CatalogFilterState = {
  mode: 'all',
  subcategoryIds: [],
  gender: null,
  cityIds: [],
  sort: 'newest',
}

describe('applyFilters', () => {
  it('возвращает пользователей по дате от новых к старым и не меняет входной массив', () => {
    const input = [...users]

    const result = applyFilters(input, skills, baseFilter, '')

    expect(result.map((user) => user.id)).toEqual(['u1', 'u2', 'u3'])
    expect(input).toEqual(users)
    expect(result).not.toBe(input)
  })

  it('ищет без учёта регистра и пробелов только по названию предлагаемого навыка', () => {
    const result = applyFilters(users, skills, baseFilter, '  АНГЛИЙСКИЙ  ')

    expect(result.map((user) => user.id)).toEqual(['u2'])
  })

  it('объединяет пол и город логикой AND', () => {
    const result = applyFilters(
      users,
      skills,
      { ...baseFilter, gender: 'female', cityIds: ['kzn'] },
      '',
    )

    expect(result.map((user) => user.id)).toEqual(['u2'])
  })

  it('объединяет поиск, пол и город логикой AND', () => {
    const result = applyFilters(
      users,
      skills,
      { ...baseFilter, gender: 'male', cityIds: ['spb'] },
      'барабан',
    )

    expect(result.map((user) => user.id)).toEqual(['u1'])
  })

  it('считает несколько выбранных подкатегорий условием OR внутри блока', () => {
    const result = applyFilters(
      users,
      skills,
      { ...baseFilter, subcategoryIds: ['music', 'english'] },
      '',
    )

    expect(result.map((user) => user.id)).toEqual(['u1', 'u2', 'u3'])
  })

  it('в режиме «Могу научить» проверяет подкатегорию предлагаемого навыка', () => {
    const result = applyFilters(
      users,
      skills,
      { ...baseFilter, mode: 'teach', subcategoryIds: ['music'] },
      '',
    )

    expect(result.map((user) => user.id)).toEqual(['u1'])
  })

  it('в режиме «Хочу научиться» проверяет желаемые подкатегории автора', () => {
    const result = applyFilters(
      users,
      skills,
      { ...baseFilter, mode: 'learn', subcategoryIds: ['music'] },
      '',
    )

    expect(result.map((user) => user.id)).toEqual(['u2', 'u3'])
  })

  it('сортирует результаты от старых к новым', () => {
    const result = applyFilters(users, skills, { ...baseFilter, sort: 'oldest' }, '')

    expect(result.map((user) => user.id)).toEqual(['u3', 'u2', 'u1'])
  })

  it('не падает, если у пользователя нет связанного навыка', () => {
    const result = applyFilters(
      [createUser({ id: 'missing', teachSkillId: 'unknown' })],
      skills,
      { ...baseFilter, mode: 'teach', subcategoryIds: ['music'] },
      '',
    )

    expect(result).toEqual([])
  })
  it.each([
    ['learn', ['music'], 'female', ['kzn'], 'английский', ['u2']],
    ['learn', ['english'], 'female', [], '', []],
    ['teach', ['music'], 'female', [], '', []],
    ['all', ['music'], 'male', ['spb'], '', ['u1']],
    ['all', ['music'], null, ['kzn'], '', ['u2']],
    ['all', ['unknown'], null, [], '', []],
    ['all', [], null, ['unknown'], '', []],
    ['all', [], null, ['spb', 'kzn'], '', ['u1', 'u2', 'u3']],
    ['learn', ['music', 'english'], null, [], '', ['u1', 'u2', 'u3']],
    ['teach', ['music', 'english'], null, [], '', ['u1', 'u2']],
  ] as const)(
    'комбинирует режим %s, навыки %j, пол %s, города %j и поиск %s',
    (mode, subcategoryIds, gender, cityIds, query, expected) => {
      const result = applyFilters(
        users,
        skills,
        { ...baseFilter, mode, subcategoryIds: [...subcategoryIds], gender, cityIds: [...cityIds] },
        query,
      )
      expect(result.map((user) => user.id)).toEqual(expected)
    },
  )

  it.each(['', '   ', '\t\n'])('пустой запрос %j не ограничивает результаты', (query) => {
    expect(applyFilters(users, skills, baseFilter, query).map((user) => user.id)).toEqual([
      'u1',
      'u2',
      'u3',
    ])
  })

  it('не ищет по имени, описанию, id или желаемым подкатегориям', () => {
    const user = createUser({
      name: 'Особенное имя',
      teachSkillId: 's1',
      learnSubcategoryIds: ['необычный-запрос'],
    })
    for (const query of ['Особенное имя', 'необычный-запрос', 'music', 'авторский текст']) {
      const skill = createSkill({
        id: 's1',
        title: 'Гитара',
        subcategoryId: 'music',
        description: 'авторский текст',
      })
      expect(applyFilters([user], [skill], baseFilter, query)).toEqual([])
    }
  })

  it('работает с пустыми наборами и отсутствующим навыком при поиске', () => {
    expect(applyFilters([], [], baseFilter, '')).toEqual([])
    expect(applyFilters(users, [], baseFilter, 'барабан')).toEqual([])
    expect(
      applyFilters(users, [], { ...baseFilter, mode: 'learn', subcategoryIds: ['music'] }, '').map(
        (user) => user.id,
      ),
    ).toEqual(['u2', 'u3'])
  })

  it('при одинаковых датах сохраняет исходный порядок', () => {
    const tied = users.map((user) => ({ ...user, createdAt: '2026-01-01T00:00:00Z' }))
    expect(
      applyFilters(tied, skills, { ...baseFilter, sort: 'oldest' }, '').map((user) => user.id),
    ).toEqual(['u1', 'u2', 'u3'])
  })

  it('не изменяет замороженные данные, фильтры и порядок навыков', () => {
    const frozenUsers = Object.freeze(
      [...users].reverse().map((user) => Object.freeze({ ...user })),
    )
    const frozenSkills = Object.freeze(skills.map((skill) => Object.freeze({ ...skill })))
    const filter: CatalogFilterState = {
      ...baseFilter,
      subcategoryIds: ['music'],
    }
    Object.freeze(filter.subcategoryIds)
    Object.freeze(filter)
    const result = applyFilters(frozenUsers, frozenSkills, filter, '')
    expect(result.map((user) => user.id)).toEqual(['u1', 'u2', 'u3'])
    expect(frozenUsers.map((user) => user.id)).toEqual(['u3', 'u2', 'u1'])
  })
  it('режимы без выбранных подкатегорий учитывают наличие желаний и предложения', () => {
    const noWishes = createUser({ id: 'no-wishes', teachSkillId: 's1', learnSubcategoryIds: [] })
    const noOffer = createUser({
      id: 'no-offer',
      teachSkillId: 'unknown',
      learnSubcategoryIds: ['music'],
    })
    expect(
      applyFilters([noWishes, noOffer], skills, { ...baseFilter, mode: 'learn' }, '').map(
        (user) => user.id,
      ),
    ).toEqual(['no-offer'])
    expect(
      applyFilters([noWishes, noOffer], skills, { ...baseFilter, mode: 'teach' }, '').map(
        (user) => user.id,
      ),
    ).toEqual(['no-wishes'])
  })
})

it('ищет по несортированным id и учитывает изменение выбора при следующем вызове', () => {
  const filter: CatalogFilterState = {
    ...baseFilter,
    mode: 'teach',
    subcategoryIds: ['time-management', 'music', 'english'],
    cityIds: ['spb', 'kzn'],
  }
  const inputSkills = [...skills].reverse()
  expect(applyFilters(users, inputSkills, filter, '').map((user) => user.id)).toEqual([
    'u1',
    'u2',
    'u3',
  ])
  expect(
    applyFilters(
      users,
      inputSkills,
      { ...filter, subcategoryIds: ['english'], cityIds: ['kzn'] },
      '',
    ).map((user) => user.id),
  ).toEqual(['u2'])
  expect(filter.subcategoryIds).toEqual(['time-management', 'music', 'english'])
  expect(filter.cityIds).toEqual(['spb', 'kzn'])
  expect(inputSkills).toEqual([...skills].reverse())
})
