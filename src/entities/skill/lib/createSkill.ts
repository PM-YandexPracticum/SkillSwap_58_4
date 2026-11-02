import type { Skill } from '../model/types'


export function createSkill(overrides: Partial<Skill> = {}): Skill {
  return {
    id: 's-test',
    title: 'Тайм-менеджмент',
    description: 'Как планировать неделю и не срывать сроки.',
    categoryId: 'business',
    subcategoryId: 'time-management',
    images: [],
    authorId: 'u-test',
    createdAt: '2026-06-30T10:00:00.000Z',
    ...overrides,
  }
}
