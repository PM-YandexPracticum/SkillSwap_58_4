import { expect, type Page } from '@playwright/test'

import users from '../public/db/users.json' with { type: 'json' }
import skills from '../public/db/skills.json' with { type: 'json' }
import { MOCK_DB, ROUTES, STORAGE_KEYS } from '../src/shared/config'

/** Действующие образцы: не копируем JSON и не вызываем внутренние функции приложения. */
export const seed = { users, skills }
export const author = users[0]
export const skill = skills.find((item) => item.id === author.teachSkillId)!
export const visitor = users.find((item) => item.id !== author.id)!
// Фиксированная карточка из текущего public/db для независимой проверки навигации.
export const popularAuthor = users.find((item) => item.id === 'u17')!
export const popularSkill = skills.find((item) => item.id === popularAuthor.teachSkillId)!

/** Секции существуют только после окончания общей стартовой загрузки. */
export async function expectCatalog(page: Page) {
  await expect(page.getByRole('heading', { name: 'Каталог предложений' })).toBeVisible()
  await expect(page.getByRole('region', { name: 'Популярное', exact: true })).toBeVisible()
  await expect(page.getByRole('region', { name: 'Новое', exact: true })).toBeVisible()
}

/**
 * Подготовленная сессия из контракта localStorage — только предусловие тестов обмена.
 * Запись однократная: reload не пересоздаёт и не очищает данные сценария.
 * Реальный вход и панель вошедшего будут проверяться после P4-09/P5-09.
 */
export async function prepareExchange(page: Page) {
  await page.goto(ROUTES.LOGIN)
  await expect(page.getByRole('heading', { name: 'Вход', exact: true })).toBeVisible()
  await page.evaluate(
    ({ sessionKey, prefix, userId }) => {
      localStorage.setItem(sessionKey, JSON.stringify({ userId, token: `mock_token_${userId}` }))
      localStorage.setItem(`${prefix}exchanges`, '[]')
      localStorage.setItem(`${prefix}notifications`, '[]')
    },
    { sessionKey: STORAGE_KEYS.SESSION, prefix: MOCK_DB.STORAGE_PREFIX, userId: visitor.id },
  )
}
