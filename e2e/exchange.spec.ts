import { expect, test, type Page } from '@playwright/test'

// Только типы контракта хранения: публичные index.ts также подключают React и Redux.
import type { Exchange } from '../src/entities/exchange/model/types'
import type { Notification } from '../src/entities/notification/model/types'
import { getSkillRoute, MOCK_DB } from '../src/shared/config'
import { author, prepareExchange, skill, visitor } from './helpers'

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
})

test('после сбоя записи уведомления повтор на странице навыка завершает прежний обмен', async ({
  page,
}) => {
  await prepareExchange(page)
  await page.goto(getSkillRoute(skill.id))
  // Инъекция реального сбоя localStorage: внутренняя логика приложения не подменяется.
  await page.evaluate((key) => {
    const original = Storage.prototype.setItem
    Storage.prototype.setItem = function (name: string, value: string) {
      if (name === key) {
        Storage.prototype.setItem = original
        throw new DOMException('E2E storage limit', 'QuotaExceededError')
      }
      return original.call(this, name, value)
    }
  }, `${MOCK_DB.STORAGE_PREFIX}notifications`)
  await page.getByRole('button', { name: 'Предложить обмен', exact: true }).click()
  await expect(page.getByRole('alert')).toContainText('Не хватает места в браузере')
  await expect(page.getByRole('dialog')).toHaveCount(0)
  const beforeRetry = await readProposal(page)
  expect(beforeRetry.exchanges).toHaveLength(1)
  expect(beforeRetry.exchanges[0].notificationPending).toBe(true)
  expect(beforeRetry.notifications).toHaveLength(0)

  // Полная перезагрузка создаёт новые store и коллекции, но оставляет незавершённую запись.
  await page.reload()
  await page.getByRole('button', { name: 'Предложить обмен', exact: true }).click()
  await expect(page.getByRole('dialog', { name: 'Вы предложили обмен', exact: true })).toBeVisible()
  await expectCompletedProposal(page)
  expect((await readProposal(page)).exchanges[0].id).toBe(beforeRetry.exchanges[0].id)

  await page.getByRole('dialog').getByRole('button', { name: 'Готово' }).click()
})
