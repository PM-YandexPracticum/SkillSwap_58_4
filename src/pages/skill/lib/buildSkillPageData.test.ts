import type { Category } from '@/entities/category'
import { createSkill } from '@/entities/skill/testing'
import { createUser } from '@/entities/user/testing'

import { buildSkillPageData, type SkillPageSources } from './buildSkillPageData'

const categories: Category[] = [
  {
    id: 'creativity',
    title: 'Творчество и искусство',
    icon: 'creative',
    color: 'creativity',
    subcategories: [
      { id: 'music', categoryId: 'creativity', title: 'Музыка и звук' },
      { id: 'photo', categoryId: 'creativity', title: 'Фотография' },
    ],
  },
  {
    id: 'languages',
    title: 'Иностранные языки',
    icon: 'languages',
    color: 'languages',
    subcategories: [{ id: 'english', categoryId: 'languages', title: 'Английский' }],
  },
]

const author = createUser({
  id: 'u01',
  teachSkillId: 's01',
  cityId: 'spb',
  learnSubcategoryIds: ['english', 'photo'],
})
const skill = createSkill({
  id: 's01',
  authorId: 'u01',
  categoryId: 'creativity',
  subcategoryId: 'music',
})
const sameSubcategory = createUser({ id: 'u02', teachSkillId: 's02' })
const otherSubcategory = createUser({ id: 'u03', teachSkillId: 's03' })

const sources: SkillPageSources = {
  skillId: 's01',
  skills: [
    skill,
    createSkill({ id: 's02', authorId: 'u02', categoryId: 'creativity', subcategoryId: 'music' }),
    createSkill({ id: 's03', authorId: 'u03', categoryId: 'creativity', subcategoryId: 'photo' }),
  ],
  users: [author, sameSubcategory, otherSubcategory],
  categories,
  cities: [{ id: 'spb', name: 'Санкт-Петербург' }],
}

describe('buildSkillPageData', () => {
  it('находит автора по authorId навыка, а не по id навыка', () => {
    const data = buildSkillPageData(sources)

    expect(data?.skill).toEqual(skill)
    expect(data?.author.id).toBe('u01')
  })

  it('собирает название города, категории и подкатегории из справочников', () => {
    const data = buildSkillPageData(sources)

    expect(data?.cityName).toBe('Санкт-Петербург')
    expect(data?.categoryTitle).toBe('Творчество и искусство')
    expect(data?.subcategoryTitle).toBe('Музыка и звук')
  })

  it('«Хочет научиться»: подкатегории автора в его порядке, каждая со своей категорией', () => {
    const data = buildSkillPageData(sources)

    expect(data?.learnSubcategories).toEqual([
      { id: 'english', title: 'Английский', categoryId: 'languages' },
      { id: 'photo', title: 'Фотография', categoryId: 'creativity' },
    ])
  })

  it('пропускает подкатегории, которых нет в справочнике', () => {
    const data = buildSkillPageData({
      ...sources,
      users: [createUser({ ...author, learnSubcategoryIds: ['unknown', 'english'] })],
    })

    expect(data?.learnSubcategories.map((item) => item.id)).toEqual(['english'])
  })

  it('похожие — другие пользователи с навыком из той же подкатегории, без автора', () => {
    const data = buildSkillPageData(sources)

    expect(data?.similarUsers.map((user) => user.id)).toEqual(['u02'])
  })

  it('не отдаёт пароль ни автора, ни похожих', () => {
    const data = buildSkillPageData(sources)

    expect(data?.author).not.toHaveProperty('password')
    expect(data?.similarUsers[0]).not.toHaveProperty('password')
  })

  it('если города нет в справочнике — «Город не указан», а не пустая строка', () => {
    const data = buildSkillPageData({ ...sources, cities: [] })

    expect(data?.cityName).toBe('Город не указан')
  })

  it('если категории нет в справочнике — пустые названия, страница не падает', () => {
    const data = buildSkillPageData({ ...sources, categories: [] })

    expect(data?.categoryTitle).toBe('')
    expect(data?.subcategoryTitle).toBe('')
    expect(data?.learnSubcategories).toEqual([])
  })

  it('нет такого навыка — null', () => {
    expect(buildSkillPageData({ ...sources, skillId: 'unknown' })).toBeNull()
  })

  it('у навыка нет автора — null', () => {
    expect(buildSkillPageData({ ...sources, users: [sameSubcategory] })).toBeNull()
  })
})
