import { expect, test } from '@playwright/test'

import { MOCK_DB, ROUTES } from '../src/shared/config'
import { expectCatalog } from './helpers'

for (const collection of ['users', 'skills', 'categories', 'cities']) {
  test(`ошибка ${collection}.json восстанавливается с 500 без повторной загрузки остальных коллекций`, async ({
    page,
  }) => {
    const requests: Record<string, number> = {}
    await page.route('**/db/*.json', async (route) => {
      const name = new URL(route.request().url()).pathname.split('/').at(-1)!
      requests[name] = (requests[name] ?? 0) + 1
      if (name === `${collection}.json` && requests[name] === 1) {
        await route.fulfill({ status: 503, contentType: 'text/plain', body: 'E2E unavailable' })
      } else {
        await route.continue()
      }
    })
    await page.goto(ROUTES.HOME)
    await expect(page).toHaveURL(ROUTES.SERVER_ERROR)
    await expect(page.getByRole('heading', { name: 'На сервере произошла ошибка' })).toBeVisible()
    await page.getByRole('button', { name: 'На главную' }).click()
    await expectCatalog(page)
    for (const name of ['users', 'skills', 'categories', 'cities']) {
      expect(requests[`${name}.json`]).toBe(name === collection ? 2 : 1)
    }
  })
}

test('сохранённый пустой список отличается от ошибки загрузки и исчезает после сброса с перезагрузкой', async ({
  page,
}) => {
  await page.goto(ROUTES.LOGIN)
  await expect(page.getByRole('heading', { name: 'Вход', exact: true })).toBeVisible()
  await page.evaluate((key) => localStorage.setItem(key, '[]'), `${MOCK_DB.STORAGE_PREFIX}users`)
  await page.goto(ROUTES.HOME)
  await expect(page.getByRole('status')).toHaveText('Предложения пока не добавлены')
  await expect(page).toHaveURL(ROUTES.HOME)
  await page.evaluate(() => localStorage.clear())
  await page.reload()
  await expectCatalog(page)
})
