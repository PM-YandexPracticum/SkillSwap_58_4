import { expect, test } from '@playwright/test'

import { getSkillRoute, ROUTES } from '../src/shared/config'
import { expectCatalog, skill } from './helpers'

test('навык открывается по прямой ссылке и после перезагрузки', async ({ page }) => {
  await page.goto(getSkillRoute(skill.id))
  await expect(page.getByRole('heading', { level: 1, name: skill.title })).toBeVisible()
  await page.reload()
  await expect(page.getByRole('heading', { level: 1, name: skill.title })).toBeVisible()
  await expect(page.getByText(skill.description, { exact: true })).toBeVisible()
})

for (const route of ['/unknown-e2e-page', getSkillRoute('unknown-e2e-skill')]) {
  test(`несуществующий адрес ${route} показывает 404 и позволяет вернуться в каталог`, async ({
    page,
  }) => {
    await page.goto(route)
    await expect(page.getByRole('heading', { name: 'Страница не найдена' })).toBeVisible()
    await page.getByRole('button', { name: 'На главную' }).click()
    await expect(page).toHaveURL(ROUTES.HOME)
    await expectCatalog(page)
  })
}

for (const route of [ROUTES.FAVORITES, `${ROUTES.PROFILE}/personal`]) {
  test(`гость по адресу ${route} попадает на вход`, async ({ page }) => {
    await page.goto(`${route}?source=e2e#saved`)
    await expect(page).toHaveURL(ROUTES.LOGIN)
    await expect(page.getByRole('heading', { name: 'Вход', exact: true })).toBeVisible()
  })
}

for (const route of [ROUTES.REGISTER_STEP_2, ROUTES.REGISTER_STEP_3]) {
  test(`новый контекст не пускает напрямую на ${route}`, async ({ page }) => {
    await page.goto(route)
    await expect(page).toHaveURL(ROUTES.REGISTER_STEP_1)
    await expect(page.getByRole('textbox', { name: 'Email', exact: true })).toBeVisible()
    await page.getByRole('button', { name: 'Закрыть', exact: true }).click()
    await expectCatalog(page)
  })
}

test('гость переходит со страницы навыка на вход и может закрыть форму', async ({ page }) => {
  await page.goto(getSkillRoute(skill.id))
  await page.getByRole('button', { name: 'Предложить обмен', exact: true }).click()
  await expect(page).toHaveURL(ROUTES.LOGIN)
  await page.getByRole('button', { name: 'Закрыть', exact: true }).click()
  await expect(page).toHaveURL(getSkillRoute(skill.id))
  await expect(page.getByRole('heading', { level: 1, name: skill.title })).toBeVisible()
})
