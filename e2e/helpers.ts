import { expect, type Page } from '@playwright/test'

import users from '../public/db/users.json' with { type: 'json' }
import skills from '../public/db/skills.json' with { type: 'json' }
import { MOCK_DB, ROUTES } from '../src/shared/config'

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

/** Выполняет настоящий вход; готовность шапки подтверждает восстановленную сессию. */
export async function login(page: Page, user = visitor) {
  await page.goto(ROUTES.LOGIN)
  await submitLogin(page, user)
}

/** Заполняет уже открытую форму, сохраняя адрес возврата после входа. */
export async function submitLogin(page: Page, user = visitor) {
  await page.getByRole('textbox', { name: 'Email', exact: true }).fill(user.email)
  await page.getByLabel('Пароль', { exact: true }).fill(user.password)
  await page.getByRole('button', { name: 'Войти', exact: true }).click()
  await expect(page.getByRole('button', { name: user.name, exact: true })).toBeVisible()
}

/** Однократный сбой браузерного хранилища без подмены внутренних функций приложения. */
export async function failNextStorageWrite(page: Page, key: string) {
  await page.evaluate((storageKey) => {
    const original = Storage.prototype.setItem
    Storage.prototype.setItem = function (name: string, value: string) {
      if (name === storageKey) {
        Storage.prototype.setItem = original
        throw new DOMException('E2E storage limit', 'QuotaExceededError')
      }
      return original.call(this, name, value)
    }
  }, key)
}

/** Пустые обмены и уведомления — предусловие; вход выполняется через настоящую форму. */
export async function prepareExchange(page: Page) {
  await page.goto(ROUTES.LOGIN)
  await expect(page.getByRole('heading', { name: 'Вход', exact: true })).toBeVisible()
  await page.evaluate((prefix) => {
    localStorage.setItem(`${prefix}exchanges`, '[]')
    localStorage.setItem(`${prefix}notifications`, '[]')
  }, MOCK_DB.STORAGE_PREFIX)
  await submitLogin(page)
}
