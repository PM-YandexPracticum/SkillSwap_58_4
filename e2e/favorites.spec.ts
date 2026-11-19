import { expect, test } from '@playwright/test'

import { getSkillRoute, MOCK_DB, ROUTES } from '../src/shared/config'
import { author, failNextStorageWrite, login, popularAuthor, popularSkill } from './helpers'

test('лайк меняет счётчик и избранное, сохраняется после перезагрузки и снимается', async ({
  page,
}) => {
  await login(page, author)
  await page.goto(getSkillRoute(popularSkill.id))
  await expect(
    page
      .getByRole('region', { name: 'Навык', exact: true })
      .getByLabel(`Количество лайков: ${popularAuthor.likesCount}`, { exact: true }),
  ).toBeVisible()
  await page
    .getByRole('region', { name: 'Навык', exact: true })
    .getByRole('button', { name: 'Добавить в избранное', exact: true })
    .click()
  await expect(
    page
      .getByRole('region', { name: 'Навык', exact: true })
      .getByRole('button', { name: 'Убрать из избранного', exact: true }),
  ).toHaveAttribute('aria-pressed', 'true')
  await expect(
    page
      .getByRole('region', { name: 'Навык', exact: true })
      .getByLabel(`Количество лайков: ${popularAuthor.likesCount + 1}`, { exact: true }),
  ).toBeVisible()
  await page.getByRole('link', { name: 'Избранное', exact: true }).click()
  const cards = page.getByRole('region', { name: 'Избранное', exact: true }).getByRole('article')
  await expect(cards).toHaveCount(1)
  await expect(cards).toContainText(popularAuthor.name)
  await page.reload()
  await expect(cards).toHaveCount(1)
  await expect(cards.getByRole('button', { name: 'Убрать из избранного' })).toHaveAttribute(
    'aria-pressed',
    'true',
  )
  await cards.getByRole('button', { name: 'Убрать из избранного' }).click()
  await expect(page.getByRole('status')).toContainText('В избранном пока нет предложений')
  await page.reload()
  await expect(page.getByRole('status')).toContainText('В избранном пока нет предложений')
  await page.getByRole('button', { name: 'Вернуться в каталог' }).click()
  await expect(page).toHaveURL(ROUTES.HOME)
  await page.goto(getSkillRoute(popularSkill.id))
  await expect(
    page
      .getByRole('region', { name: 'Навык', exact: true })
      .getByLabel(`Количество лайков: ${popularAuthor.likesCount}`, { exact: true }),
  ).toBeVisible()
})

test('сбой сохранения лайка не меняет счётчик или избранное, повтор работает', async ({ page }) => {
  await login(page, author)
  await page.goto(getSkillRoute(popularSkill.id))
  const add = page
    .getByRole('region', { name: 'Навык', exact: true })
    .getByRole('button', { name: 'Добавить в избранное', exact: true })
  await expect(add).toBeEnabled()
  await failNextStorageWrite(page, `${MOCK_DB.STORAGE_PREFIX}users`)
  await add.click()
  await expect(page.getByRole('log', { name: 'Уведомления' })).toContainText(
    'Не хватает места в браузере',
  )
  await expect(add).toHaveAttribute('aria-pressed', 'false')
  await expect(
    page
      .getByRole('region', { name: 'Навык', exact: true })
      .getByLabel(`Количество лайков: ${popularAuthor.likesCount}`, { exact: true }),
  ).toBeVisible()
  await page.reload()
  await expect(add).toHaveAttribute('aria-pressed', 'false')
  await add.click()
  await page.getByRole('link', { name: 'Избранное', exact: true }).click()
  await expect(
    page.getByRole('region', { name: 'Избранное', exact: true }).getByRole('article'),
  ).toHaveCount(1)
})
