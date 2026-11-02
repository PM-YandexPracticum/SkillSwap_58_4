import type { User } from '../model/types'

/**
 * Фабрика тестового пользователя — для тестов и stories.
 * Возвращает полного валидного пользователя; передай только поля, важные для проверки:
 * `createUser({ gender: 'female' })`, `createUser({ id: 'u2', name: 'Анна' })`.
 *
 * Не путать с `createUser` из `entities/user/api` — тот сохраняет пользователя в «базу».
 * Снаружи слайса импортировать из `@/entities/user/testing`.
 *
 * По умолчанию ссылается на `createSkill()` (`teachSkillId`), город и подкатегории из образцов.
 */
export function createUser(overrides: Partial<User> = {}): User {
  return {
    id: 'u-test',
    name: 'Иван',
    email: 'test@example.com',
    password: 'SkillSwap2025',
    avatarUrl: null,
    birthDate: '1992-03-15T10:00:00.000Z',
    gender: 'male',
    cityId: 'spb',
    about: 'Тестовый пользователь.',
    teachSkillId: 's-test',
    learnSubcategoryIds: ['time-management', 'english'],
    likedUserIds: [],
    likesCount: 10,
    createdAt: '2026-06-30T10:00:00.000Z',
    ...overrides,
  }
}
