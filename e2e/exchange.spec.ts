import { expect, test, type Page } from '@playwright/test'

// Только типы контракта хранения: публичные index.ts также подключают React и Redux.
import type { Exchange } from '../src/entities/exchange/model/types'
import type { Notification } from '../src/entities/notification/model/types'
import { getSkillRoute, MOCK_DB, ROUTES } from '../src/shared/config'
import { author, failNextStorageWrite, login, prepareExchange, skill, visitor } from './helpers'

/** Проверяем сохранение через публичный контракт хранилища, без чтения Redux из window. */
async function readProposal(page: Page) {
  return page.evaluate(
    ({ prefix, fromUserId, toUserId }) => {
      const exchanges: Exchange[] = JSON.parse(localStorage.getItem(`${prefix}exchanges`) ?? '[]')
      const notifications: Notification[] = JSON.parse(
        localStorage.getItem(`${prefix}notifications`) ?? '[]',
      )
      return {
        exchanges: exchanges.filter(
          (item) => item.fromUserId === fromUserId && item.toUserId === toUserId,
        ),
        notifications: notifications.filter(
          (item) => item.userId === fromUserId && item.toUserId === toUserId,
        ),
      }
    },
    { prefix: MOCK_DB.STORAGE_PREFIX, fromUserId: visitor.id, toUserId: author.id },
  )
}

async function expectCompletedProposal(page: Page) {
  const saved = await readProposal(page)
  expect(saved.exchanges).toHaveLength(1)
  expect(saved.exchanges[0]).toMatchObject({
    fromUserId: visitor.id,
    toUserId: author.id,
    skillId: skill.id,
    notificationPending: false,
  })
  expect(saved.notifications).toHaveLength(1)
  expect(saved.notifications[0]).toMatchObject({
    userId: visitor.id,
    toUserId: author.id,
    exchangeId: saved.exchanges[0].id,
    isRead: false,
  })
}

test('обмен показывает toast и подтверждение, сохраняется после перезагрузки без дублей', async ({
  page,
}) => {
  await prepareExchange(page)
  await page.goto(getSkillRoute(skill.id))
  await page.getByRole('button', { name: 'Предложить обмен', exact: true }).click()
  const dialog = page.getByRole('dialog', { name: 'Вы предложили обмен', exact: true })
  await expect(dialog).toBeVisible()
  await expect(page.getByRole('log', { name: 'Уведомления' })).toContainText('Вы предложили обмен')
  await expectCompletedProposal(page)
  await dialog.getByRole('button', { name: 'Готово', exact: true }).click()
  await expect(page.getByRole('button', { name: 'Обмен предложен', exact: true })).toBeDisabled()
  await page.reload()
  await expect(page.getByRole('button', { name: 'Обмен предложен', exact: true })).toBeDisabled()
  await expect(dialog).toHaveCount(0)
  await expectCompletedProposal(page)
  await page.getByRole('banner').getByRole('link', { name: 'SkillSwap', exact: true }).click()
  await expect(page).toHaveURL(ROUTES.HOME)
  await page.getByRole('button', { name: 'Уведомления, есть новые', exact: true }).click()
  const panel = page.getByRole('region', { name: 'Уведомления', exact: true })
  await expect(panel).toContainText('Вы предложили обмен')
  await panel.getByRole('button', { name: /^Перейти/ }).click()
  await expect(page).toHaveURL(getSkillRoute(skill.id))
  await expect(page.getByRole('heading', { level: 1, name: skill.title })).toBeVisible()
  await expect(panel).toHaveCount(0)
})

test('после сбоя записи уведомления каталог сохраняет путь к повтору прежнего обмена', async ({
  page,
}) => {
  await prepareExchange(page)
  await page.goto(getSkillRoute(skill.id))
  await failNextStorageWrite(page, `${MOCK_DB.STORAGE_PREFIX}notifications`)
  await page.getByRole('button', { name: 'Предложить обмен', exact: true }).click()
  await expect(page.getByRole('alert')).toContainText('Не хватает места в браузере')
  await expect(page.getByRole('dialog')).toHaveCount(0)
  const beforeRetry = await readProposal(page)
  expect(beforeRetry.exchanges).toHaveLength(1)
  expect(beforeRetry.exchanges[0].notificationPending).toBe(true)
  expect(beforeRetry.notifications).toHaveLength(0)

  // Возвращаемся через пользовательскую навигацию, не сбрасывая Redux при смене маршрута.
  await page.getByRole('banner').getByRole('link', { name: 'SkillSwap', exact: true }).click()
  await expect(page).toHaveURL(ROUTES.HOME)
  const search = page.getByRole('textbox', { name: 'Искать навык' })
  await search.fill(skill.title)
  await search.press('Enter')
  const card = page
    .getByRole('region', { name: 'Подходящие предложения: 1', exact: true })
    .getByRole('article')
  await card.getByRole('link', { name: 'Подробнее' }).click()
  await expect(page).toHaveURL(getSkillRoute(skill.id))
  // Незавершённый обмен также должен допускать повтор после полной перезагрузки страницы.
  await page.reload()
  await page.getByRole('button', { name: 'Предложить обмен', exact: true }).click()
  await expect(page.getByRole('dialog', { name: 'Вы предложили обмен', exact: true })).toBeVisible()
  await expectCompletedProposal(page)
  expect((await readProposal(page)).exchanges[0].id).toBe(beforeRetry.exchanges[0].id)

  await page.getByRole('dialog').getByRole('button', { name: 'Готово' }).click()
})

test('после сбоя загрузки обменов повтор предложения восстанавливает сохранённый статус без дублей', async ({
  page,
}) => {
  const exchange: Exchange = {
    id: 'e2e-existing-exchange',
    fromUserId: visitor.id,
    toUserId: author.id,
    skillId: skill.id,
    createdAt: '2026-11-01T12:00:00.000Z',
    notificationPending: false,
  }
  let requests = 0
  await page.route('**/db/exchanges.json', async (route) => {
    requests += 1
    if (requests <= 2) await route.fulfill({ status: 503, body: 'E2E unavailable' })
    else await route.fulfill({ json: [exchange] })
  })
  // Форма входа возвращает в каталог, где первая попытка ленивой загрузки падает.
  await login(page)
  await expect.poll(() => requests).toBe(1)
  const search = page.getByRole('textbox', { name: 'Искать навык' })
  await search.fill(skill.title)
  await search.press('Enter')
  await page
    .getByRole('region', { name: 'Подходящие предложения: 1', exact: true })
    .getByRole('link', { name: 'Подробнее', exact: true })
    .click()
  await expect.poll(() => requests).toBe(2)
  // После второй ошибки кнопка остаётся доступной: пользователь явно повторяет действие.
  await page.getByRole('button', { name: 'Предложить обмен', exact: true }).click()
  await expect(page.getByRole('button', { name: 'Обмен предложен', exact: true })).toBeDisabled()
  await expect(page.getByRole('dialog', { name: 'Вы предложили обмен' })).toBeVisible()
  expect(requests).toBe(3)
  // Образцы читаются по HTTP, но сами не записываются в localStorage.
  // Появление записи здесь означало бы повторное создание уже существующего обмена.
  expect(
    await page.evaluate((key) => localStorage.getItem(key), `${MOCK_DB.STORAGE_PREFIX}exchanges`),
  ).toBeNull()
  await page.getByRole('dialog').getByRole('button', { name: 'Готово' }).click()
  await page.reload()
  await expect(page.getByRole('button', { name: 'Обмен предложен', exact: true })).toBeDisabled()
  await expect(page.getByRole('dialog')).toHaveCount(0)
})
