import { expect, test } from '@playwright/test'

import { getSkillRoute, ROUTES, STORAGE_KEYS } from '../src/shared/config'
import { expectCatalog, login, skill, submitLogin, visitor } from './helpers'

test('неверный пароль не создаёт сессию; исправление позволяет войти', async ({ page }) => {
  await page.goto(ROUTES.LOGIN)
  await page.getByRole('textbox', { name: 'Email', exact: true }).fill(visitor.email)
  const password = page.getByLabel('Пароль', { exact: true })
  await password.fill('WrongPassword2026')
  await page.getByRole('button', { name: 'Войти', exact: true }).click()
  await expect(page.getByRole('alert')).toHaveText('Email или пароль введён неверно')
  await expect(page).toHaveURL(ROUTES.LOGIN)
  expect(await page.evaluate((key) => localStorage.getItem(key), STORAGE_KEYS.SESSION)).toBeNull()
  await password.fill(visitor.password)
  await expect(page.getByRole('alert')).toHaveCount(0)
  await page.getByRole('button', { name: 'Войти', exact: true }).click()
  await expectCatalog(page)
  await expect(page.getByRole('button', { name: visitor.name, exact: true })).toBeVisible()
})

test('гость предлагает обмен, входит и возвращается к тому же навыку', async ({ page }) => {
  const address = `${getSkillRoute(skill.id)}?source=e2e#offer`
  await page.goto(address)
  await page.getByRole('button', { name: 'Предложить обмен', exact: true }).click()
  await expect(page).toHaveURL(ROUTES.LOGIN)
  await submitLogin(page)
  await expect(page).toHaveURL(address)
  await expect(page.getByRole('heading', { level: 1, name: skill.title })).toBeVisible()
  await expect(page.getByRole('button', { name: 'Предложить обмен', exact: true })).toBeEnabled()
})

test('вход сохраняется после перезагрузки, выход закрывает личные страницы', async ({ page }) => {
  await login(page)
  await page.goto(`${ROUTES.PROFILE}/personal`)
  await page.reload()
  await expect(page.getByRole('button', { name: visitor.name, exact: true })).toBeVisible()
  await page.getByRole('button', { name: visitor.name, exact: true }).click()
  await page.getByRole('button', { name: 'Выйти', exact: true }).click()
  await expectCatalog(page)
  await expect(page.getByRole('button', { name: 'Войти', exact: true })).toBeVisible()
  expect(await page.evaluate((key) => localStorage.getItem(key), STORAGE_KEYS.SESSION)).toBeNull()
  await page.goto(`${ROUTES.PROFILE}/personal`)
  await expect(page).toHaveURL(ROUTES.LOGIN)
  await page.reload()
  await expect(page).toHaveURL(ROUTES.LOGIN)
})

test('неизвестный владелец сохранённой сессии становится гостем после загрузки данных', async ({
  page,
}) => {
  await page.goto(ROUTES.LOGIN)
  await page.evaluate((key) => {
    localStorage.setItem(
      key,
      JSON.stringify({ userId: 'unknown-e2e', token: 'mock_token_unknown' }),
    )
  }, STORAGE_KEYS.SESSION)
  await page.goto(ROUTES.FAVORITES)
  await expect(page).toHaveURL(ROUTES.LOGIN)
  await expect(page.getByRole('heading', { name: 'Вход', exact: true })).toBeVisible()
  expect(await page.evaluate((key) => localStorage.getItem(key), STORAGE_KEYS.SESSION)).toBeNull()
})

test('выход завершает сессию до окончания ленивой загрузки каталога', async ({ page }) => {
  await login(page)
  await page.goto(`${ROUTES.PROFILE}/personal`)
  // Полная навигация выше создаёт новый документ без загруженного lazy-модуля каталога.
  let release!: () => void
  const blocked = new Promise<void>((resolve) => {
    release = resolve
  })
  await page.route('**/src/pages/catalog/index.ts*', async (route) => {
    await blocked
    await route.continue()
  })
  try {
    await page.getByRole('button', { name: visitor.name, exact: true }).click()
    const request = page.waitForRequest('**/src/pages/catalog/index.ts*')
    await page.getByRole('button', { name: 'Выйти', exact: true }).click()
    await request
    expect(await page.evaluate((key) => localStorage.getItem(key), STORAGE_KEYS.SESSION)).toBeNull()
  } finally {
    release()
  }
  await expectCatalog(page)
})
