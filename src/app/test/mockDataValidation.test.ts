import { getUsers } from '@/entities/user'
import { getSkills } from '@/entities/skill'
import { getCategories } from '@/entities/category'
import { getCities } from '@/entities/city'
import { getExchanges } from '@/entities/exchange'
import { getNotifications } from '@/entities/notification'
import { MOCK_DB } from '@/shared/config'
import { createUser } from '@/entities/user/testing'
import { createSkill } from '@/entities/skill/testing'
import { createCategory } from '@/entities/category/testing'
import { createNotification } from '@/entities/notification/testing'

const collections = [
  { name: 'users', read: getUsers },
  { name: 'skills', read: getSkills },
  { name: 'categories', read: getCategories },
  { name: 'cities', read: getCities },
  { name: 'exchanges', read: getExchanges },
  { name: 'notifications', read: getNotifications },
]

describe('runtime-проверка данных сущностей', () => {
  it.each([
    { name: 'users', read: getUsers, record: { ...createUser(), birthDate: '2000-02-31' } },
    { name: 'users', read: getUsers, record: { ...createUser(), likesCount: '10' } },
    { name: 'skills', read: getSkills, record: { ...createSkill(), images: [123] } },
    {
      name: 'categories',
      read: getCategories,
      record: { ...createCategory(), subcategories: [{ id: 'broken' }] },
    },
    { name: 'cities', read: getCities, record: { id: 'broken', name: 123 } },
    {
      name: 'exchanges',
      read: getExchanges,
      record: {
        id: 'broken',
        fromUserId: 'u1',
        toUserId: 'u2',
        skillId: 's1',
        createdAt: '2026-02-31T10:00:00Z',
      },
    },
    {
      name: 'notifications',
      read: getNotifications,
      record: { ...createNotification(), isRead: 'false' },
    },
  ])('$name: не принимает запись с неверным обязательным полем', async ({ name, read, record }) => {
    const key = `${MOCK_DB.STORAGE_PREFIX}${name}`
    localStorage.setItem(key, JSON.stringify([record]))
    await read()
    expect(localStorage.getItem(key)).toBeNull()
  })

  it.each(collections)('$name: запись только с id сбрасывается к seed', async ({ name, read }) => {
    const key = `${MOCK_DB.STORAGE_PREFIX}${name}`
    localStorage.setItem(key, JSON.stringify([{ id: 'broken' }]))
    const records = await read()
    expect(records.every((record) => record.id !== 'broken')).toBe(true)
    expect(localStorage.getItem(key)).toBeNull()
  })

  it.each(collections)(
    '$name: сохранённый пустой список остаётся пустым',
    async ({ name, read }) => {
      localStorage.setItem(`${MOCK_DB.STORAGE_PREFIX}${name}`, '[]')
      expect(await read()).toEqual([])
    },
  )
})
