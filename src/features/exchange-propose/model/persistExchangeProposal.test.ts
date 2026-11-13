import { createNotification as createNotificationData } from '@/entities/notification/testing'
import * as notificationApi from '@/entities/notification'
import { createTestStore } from '@/app/test/createTestStore'
import { addExchange, fetchExchanges, getExchanges } from '@/entities/exchange'
import {
  clearAllNotifications,
  createNotification,
  getNotifications,
} from '@/entities/notification'
import { DATA_ERRORS, MOCK_DB } from '@/shared/config'

import { persistExchangeProposal, proposeExchange } from './proposeExchange'

const createProposal = () =>
  proposeExchange({
    fromUserId: 'proposal-sender',
    toUserId: 'proposal-recipient',
    skillId: 'proposal-skill',
    toUserName: 'Павел',
    createdAt: '2026-11-12T10:00:00.000Z',
  })
const signedInStore = () =>
  createTestStore({
    session: { session: { userId: 'proposal-sender', token: 'test' } },
  })

afterEach(() => vi.restoreAllMocks())

describe('persistExchangeProposal', () => {
  it.each([null, 'other-owner'])(
    'не выполняет сценарий от чужого имени при сессии %s',
    async (userId) => {
      const store = createTestStore({
        session: { session: userId ? { userId, token: 'test' } : null },
      })
      await expect(store.dispatch(persistExchangeProposal(createProposal()))).rejects.toBe(
        userId ? DATA_ERRORS.OWNER : DATA_ERRORS.SIGN_IN,
      )
      expect(store.getState().exchanges.items).toEqual([])
      expect(store.getState().notifications.items).toEqual([])
    },
  )

  it('при одновременных предложениях создаёт одну пару записей', async () => {
    const store = signedInStore()
    const proposal = createProposal()
    await Promise.all([
      store.dispatch(persistExchangeProposal(proposal)),
      store.dispatch(persistExchangeProposal(proposal)),
    ])
    expect(
      (await getExchanges()).filter((item) => item.fromUserId === proposal.exchange.fromUserId),
    ).toHaveLength(1)
    expect(
      (await getNotifications()).filter((item) => item.exchangeId === proposal.exchange.id),
    ).toHaveLength(1)
    expect(
      store.getState().exchanges.items.find((item) => item.id === proposal.exchange.id)
        ?.notificationPending,
    ).toBe(false)
  })

  it('не перезаписывает уже прочитанное уведомление незавершённого обмена', async () => {
    const store = signedInStore()
    const proposal = createProposal()
    await store.dispatch(addExchange(proposal.exchange)).unwrap()
    const read = createNotificationData({
      id: 'existing-notification',
      userId: proposal.exchange.fromUserId,
      toUserId: proposal.exchange.toUserId,
      exchangeId: proposal.exchange.id,
      createdAt: proposal.exchange.createdAt,
      isRead: true,
    })
    await createNotification(read)
    await store.dispatch(persistExchangeProposal(proposal))
    expect(
      (await getNotifications()).filter((item) => item.exchangeId === proposal.exchange.id),
    ).toEqual([read])
  })

  it('после очистки уведомлений не восстанавливает их для завершённого обмена', async () => {
    const store = signedInStore()
    const proposal = createProposal()
    await store.dispatch(persistExchangeProposal(proposal))
    await store.dispatch(clearAllNotifications()).unwrap()
    const reloaded = signedInStore()
    await reloaded.dispatch(fetchExchanges()).unwrap()
    await reloaded.dispatch(persistExchangeProposal(proposal))
    expect(
      (await getNotifications()).filter((item) => item.userId === proposal.exchange.fromUserId),
    ).toEqual([])
  })

  it('после сбоя отметки завершения повтор не дублирует сохранённое уведомление', async () => {
    const store = signedInStore()
    const proposal = createProposal()
    const write = Storage.prototype.setItem
    let exchangeWrites = 0
    const quota = vi.spyOn(Storage.prototype, 'setItem').mockImplementation(function (
      this: Storage,
      key,
      value,
    ) {
      if (key === `${MOCK_DB.STORAGE_PREFIX}exchanges` && ++exchangeWrites === 2) {
        throw new DOMException('Quota', 'QuotaExceededError')
      }
      write.call(this, key, value)
    })
    await expect(store.dispatch(persistExchangeProposal(proposal))).rejects.toBe(
      DATA_ERRORS.STORAGE_FULL,
    )
    quota.mockRestore()
    expect(store.getState().exchanges.items[0].notificationPending).toBe(true)
    const reloaded = signedInStore()
    await reloaded.dispatch(fetchExchanges()).unwrap()
    await reloaded.dispatch(persistExchangeProposal(proposal))
    expect(
      (await getNotifications()).filter((item) => item.exchangeId === proposal.exchange.id),
    ).toHaveLength(1)
    expect(
      reloaded.getState().exchanges.items.find((item) => item.id === proposal.exchange.id)
        ?.notificationPending,
    ).toBe(false)
  })
})

it('не запрашивает полный список уведомлений при предложении или повторе', async () => {
  const store = signedInStore()
  const fetch = vi.spyOn(notificationApi, 'getNotifications')
  await store.dispatch(persistExchangeProposal(createProposal()))
  await store.dispatch(persistExchangeProposal(createProposal()))
  expect(fetch).not.toHaveBeenCalled()
  expect(store.getState().notifications.items).toHaveLength(1)
})

it('собирает уведомление по сохранённому обмену, а не по данным повторной попытки', async () => {
  const store = signedInStore()
  const original = createProposal()
  await store.dispatch(addExchange(original.exchange)).unwrap()
  const retry = proposeExchange({
    fromUserId: original.exchange.fromUserId,
    toUserId: original.exchange.toUserId,
    skillId: 'another-skill',
    toUserName: 'Павел',
    createdAt: '2026-11-13T10:00:00.000Z',
  })
  await store.dispatch(persistExchangeProposal(retry))
  expect(store.getState().notifications.items).toEqual([
    {
      id: `notification-${original.exchange.id}`,
      userId: original.exchange.fromUserId,
      toUserId: original.exchange.toUserId,
      exchangeId: original.exchange.id,
      isRead: false,
      createdAt: original.exchange.createdAt,
    },
  ])
})
