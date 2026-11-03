import { loadSeed } from './loadSeed'

/**
 * Проверяет сами файлы `public/db`: что они загружаются в тестах (через `src/setupTests.ts`)
 * и связаны между собой. Подробные правила наполнения проверяли на ревью задач P1-05…P1-08.
 */
interface Row {
  id: string
  [field: string]: unknown
}

const load = (name: string) => loadSeed<Row>(name)()
const ids = (rows: readonly Row[]) => new Set(rows.map((row) => row.id))

describe('файлы public/db', () => {
  it.each([
    { name: 'users', count: 45 },
    { name: 'skills', count: 45 },
    { name: 'categories', count: 6 },
    { name: 'cities', count: 17 },
  ])('$name: $count записей с уникальными id', async ({ name, count }) => {
    const rows = await load(name)

    expect(rows).toHaveLength(count)
    expect(ids(rows).size).toBe(count)
  })

  it('у каждого пользователя есть свой навык, город и подкатегории «Хочу научиться»', async () => {
    const [users, skills, cities, categories] = await Promise.all(
      ['users', 'skills', 'cities', 'categories'].map(load),
    )
    const skillById = new Map(skills.map((skill) => [skill.id, skill]))
    const subcategoryIds = new Set(
      categories.flatMap((category) => (category.subcategories as Row[]).map((sub) => sub.id)),
    )

    users.forEach((user) => {
      expect(skillById.get(user.teachSkillId as string)?.authorId).toBe(user.id)
      expect(ids(cities).has(user.cityId as string)).toBe(true)
      ;(user.learnSubcategoryIds as string[]).forEach((id) =>
        expect(subcategoryIds.has(id)).toBe(true),
      )
    })
  })

  it('обмены и уведомления ссылаются на существующих пользователей и навыки', async () => {
    const [users, skills, exchanges, notifications] = await Promise.all(
      ['users', 'skills', 'exchanges', 'notifications'].map(load),
    )

    exchanges.forEach((exchange) => {
      expect(ids(users).has(exchange.fromUserId as string)).toBe(true)
      expect(ids(users).has(exchange.toUserId as string)).toBe(true)
      expect(ids(skills).has(exchange.skillId as string)).toBe(true)
    })
    notifications.forEach((notification) => {
      expect(ids(exchanges).has(notification.exchangeId as string)).toBe(true)
    })
  })
})
