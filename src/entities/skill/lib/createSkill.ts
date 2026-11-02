import type { Skill } from '../model/types'

/**
 * Фабрика тестового навыка — для тестов и stories.
 * Возвращает полный валидный навык; передай только поля, важные для проверки:
 * `createSkill({ title: 'Игра на барабанах' })`, `createSkill({ authorId: user.id })`.
 *
 * Не путать с `createSkill` из `entities/skill/api` — тот сохраняет навык в «базу».
 * Снаружи слайса импортировать из `@/entities/skill/testing`.
 *
 * По умолчанию автор — `createUser()` (`u-test`), подкатегория из образцов.
 */
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
