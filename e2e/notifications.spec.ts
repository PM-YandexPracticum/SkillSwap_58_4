import { expect, test, type Page } from '@playwright/test'

import type { Notification } from '../src/entities/notification/model/types'
import { DATA_ERRORS, getSkillRoute, MOCK_DB, ROUTES } from '../src/shared/config'
import { author, failNextStorageWrite, login, seed, skill, visitor } from './helpers'

const storageKey = `${MOCK_DB.STORAGE_PREFIX}notifications`
// Две новые и одна прочитанная запись владельца; чужая запись остаётся непрочитанной.
const notifications: Notification[] = [
  {
    id: 'e2e-new',
    userId: visitor.id,
    toUserId: author.id,
    exchangeId: 'e2e-exchange-new',
    isRead: false,
    createdAt: '2026-11-01T12:00:00.000Z',
  },
  {
    id: 'e2e-read',
    userId: visitor.id,
    toUserId: seed.users[2].id,
    exchangeId: 'e2e-exchange-read',
    isRead: true,
    createdAt: '2026-11-02T12:00:00.000Z',
  },
  {
    id: 'e2e-new-2',
    userId: visitor.id,
    toUserId: seed.users[4].id,
    exchangeId: 'e2e-exchange-new-2',
    isRead: false,
    createdAt: '2026-11-01T13:00:00.000Z',
  },
  {
    id: 'e2e-foreign',
    userId: author.id,
    toUserId: seed.users[3].id,
    exchangeId: 'e2e-exchange-foreign',
    isRead: false,
    createdAt: '2026-11-03T12:00:00.000Z',
  },
]

/** Предусловие через контракт хранилища; вход и действия выполняются через UI. */
async function prepareNotifications(page: Page) {
  await page.goto(ROUTES.LOGIN)
  await page.evaluate(({ key, items }) => localStorage.setItem(key, JSON.stringify(items)), {
    key: storageKey,
    items: notifications,
  })
  await login(page)
  await page.getByRole('button', { name: 'Уведомления, есть новые', exact: true }).click()
  await expect(
    page.getByRole('region', { name: 'Уведомления', exact: true }).getByRole('article'),
  ).toHaveCount(3)
}

async function savedNotifications(page: Page): Promise<Notification[]> {
  return page.evaluate((key) => JSON.parse(localStorage.getItem(key) ?? '[]'), storageKey)
}

test('прочтение и очистка сохраняются после перезагрузки и не меняют чужие уведомления', async ({
  page,
}) => {
  await prepareNotifications(page)
  const panel = page.getByRole('region', { name: 'Уведомления', exact: true })
  await panel.getByRole('button', { name: 'Прочитать все', exact: true }).click()
  await expect(panel.getByRole('heading', { name: 'Новые уведомления' })).toHaveCount(0)
  await expect(panel.getByRole('heading', { name: 'Просмотренные' })).toBeVisible()
  await expect(panel.getByRole('button', { name: /^Перейти/ })).toHaveCount(0)
  const savedAfterRead = await savedNotifications(page)
  expect(savedAfterRead.filter((item) => item.userId === visitor.id)).toEqual(
    expect.arrayContaining([
      expect.objectContaining({ id: 'e2e-new', isRead: true }),
      expect.objectContaining({ id: 'e2e-new-2', isRead: true }),
      expect.objectContaining({ id: 'e2e-read', isRead: true }),
    ]),
  )
  expect(savedAfterRead.find((item) => item.id === 'e2e-foreign')).toEqual(notifications[3])

  await page.reload()
  await page.getByRole('button', { name: 'Уведомления', exact: true }).click()
  await expect(panel.getByRole('article')).toHaveCount(3)
  await expect(panel.getByRole('heading', { name: 'Новые уведомления' })).toHaveCount(0)
  await panel.getByRole('button', { name: 'Очистить', exact: true }).click()
  await expect(panel.getByRole('status')).toHaveText('Уведомлений пока нет')
  expect(await savedNotifications(page)).toEqual([notifications[3]])
  await page.reload()
  await page.getByRole('button', { name: 'Уведомления', exact: true }).click()
  await expect(panel.getByRole('status')).toHaveText('Уведомлений пока нет')
  expect(await savedNotifications(page)).toEqual([notifications[3]])
})

for (const action of ['Прочитать все', 'Очистить']) {
  test(`ошибка «${action}» сохраняет список и допускает повтор без ложного успеха`, async ({
    page,
  }) => {
    await prepareNotifications(page)
    const panel = page.getByRole('region', { name: 'Уведомления', exact: true })
    await failNextStorageWrite(page, storageKey)
    await panel.getByRole('button', { name: action, exact: true }).click()
    await expect(panel.getByRole('alert')).toHaveText(DATA_ERRORS.STORAGE_FULL)
    await expect(panel.getByRole('article')).toHaveCount(3)
    await expect(panel.getByRole('heading', { name: 'Новые уведомления' })).toBeVisible()
    await expect(
      page.getByRole('button', { name: 'Уведомления, есть новые', exact: true }),
    ).toBeVisible()
    expect(await savedNotifications(page)).toEqual(notifications)

    await panel.getByRole('button', { name: action, exact: true }).click()
    if (action === 'Очистить') {
      await expect(panel.getByRole('status')).toHaveText('Уведомлений пока нет')
    } else {
      await expect(panel.getByRole('heading', { name: 'Новые уведомления' })).toHaveCount(0)
      await expect(panel.getByRole('heading', { name: 'Просмотренные' })).toBeVisible()
    }
    await expect(panel.getByRole('alert')).toHaveCount(0)
    expect((await savedNotifications(page)).find((item) => item.id === 'e2e-foreign')).toEqual(
      notifications[3],
    )
    await page.reload()
    await page.getByRole('button', { name: 'Уведомления', exact: true }).click()
    await expect(panel.getByRole('article')).toHaveCount(action === 'Очистить' ? 0 : 3)
    await expect(panel.getByRole('heading', { name: 'Новые уведомления' })).toHaveCount(0)
  })
}

test('ошибка загрузки требует явного повтора; открытие панели не запускает скрытый запрос', async ({
  page,
}) => {
  let requests = 0
  await page.route('**/db/notifications.json', async (route) => {
    requests += 1
    if (requests === 1) await route.fulfill({ status: 503, body: 'E2E unavailable' })
    else await route.fulfill({ json: notifications })
  })
  await login(page)
  const bell = page.getByRole('button', { name: /^Уведомления/ })
  await bell.click()
  const panel = page.getByRole('region', { name: 'Уведомления', exact: true })
  await expect(panel.getByRole('alert')).toContainText(DATA_ERRORS.LOAD_NOTIFICATIONS)
  await expect(panel.getByText('Уведомлений пока нет')).toHaveCount(0)
  await bell.click()
  await bell.click()
  await expect(panel.getByRole('alert')).toContainText(DATA_ERRORS.LOAD_NOTIFICATIONS)
  expect(requests).toBe(1)
  await panel.getByRole('button', { name: 'Повторить', exact: true }).click()
  await expect(panel.getByRole('article')).toHaveCount(3)
  await expect(panel.getByRole('alert')).toHaveCount(0)
  expect(requests).toBe(2)
  await expect(
    page.getByRole('button', { name: 'Уведомления, есть новые', exact: true }),
  ).toBeVisible()
  await panel
    .getByRole('article')
    .filter({ hasText: 'Вы предложили обмен Ивану' })
    .getByRole('button', { name: /^Перейти/ })
    .click()
  await expect(page).toHaveURL(getSkillRoute(skill.id))
  await expect(page.getByRole('heading', { level: 1, name: skill.title })).toBeVisible()
  await expect(panel).toHaveCount(0)
})
