import { createNotification } from '../testing'
import {
  createNotification as saveNotification,
  ensureExchangeNotification,
  getNotifications,
  markAllNotificationsRead,
  clearNotifications,
  markNotificationRead,
} from './notificationApi'

const own = createNotification({ id: 'own', userId: 'owner-test' })
const other = createNotification({ id: 'other', userId: 'other-test' })

beforeEach(async () => {
  await saveNotification(own)
  await saveNotification(other)
})

describe('notificationApi', () => {
  it.each([
    { name: 'создание', save: saveNotification },
    { name: 'повтор предложения', save: ensureExchangeNotification },
  ])('$name сохраняет снимок входных данных до ожидания очереди', async ({ save }) => {
    const input = createNotification({ id: 'snapshot', userId: 'snapshot-owner' })
    const expected = { ...input }
    const pending = save(input)
    input.userId = 'changed-owner'
    input.isRead = true

    expect(await pending).toEqual(expected)
    expect(await getNotifications()).toContainEqual(expected)
  })

  it('прочитать все меняет только уведомления указанного владельца', async () => {
    await markAllNotificationsRead(own.userId)
    const result = await getNotifications()
    expect(result).toContainEqual({ ...own, isRead: true })
    expect(result).toContainEqual(other)
  })

  it('повторное чтение не меняет просмотренные уведомления', async () => {
    await markAllNotificationsRead(own.userId)
    const before = await getNotifications()
    await markAllNotificationsRead(own.userId)
    expect(await getNotifications()).toEqual(before)
  })

  it('очистить удаляет все уведомления владельца, сохраняя чужие', async () => {
    await saveNotification(createNotification({ id: 'read-own', userId: own.userId, isRead: true }))
    await clearNotifications(own.userId)
    const result = await getNotifications()
    expect(result.some((item) => item.userId === own.userId)).toBe(false)
    expect(result).toContainEqual(other)
  })

  it('очистка пустого списка ничего не удаляет у других пользователей', async () => {
    const before = await getNotifications()
    await clearNotifications('no-notifications')
    expect(await getNotifications()).toEqual(before)
  })
  it('очистка и новое уведомление в очереди не теряют новую запись', async () => {
    const fresh = createNotification({ id: 'fresh', userId: own.userId })
    await Promise.all([clearNotifications(own.userId), saveNotification(fresh)])
    expect((await getNotifications()).filter((item) => item.userId === own.userId)).toEqual([fresh])
  })
  // --- P7-05 новые тесты ---
  it('новое уведомление после «прочитать все» остаётся непрочитанным', async () => {
    const fresh = createNotification({ id: 'fresh-unread', userId: own.userId })

    await Promise.all([markAllNotificationsRead(own.userId), saveNotification(fresh)])

    const items = await getNotifications()
    expect(items).toContainEqual({ ...own, isRead: true }) // старое прочитано
    expect(items).toContainEqual(fresh) // новое — нет
  })
  it.each([
    { name: 'прочитать все', run: (userId: string) => markAllNotificationsRead(userId) },
    { name: 'очистить', run: (userId: string) => clearNotifications(userId) },
  ])('ошибка «$name» из-за переполнения хранилища не меняет записи', async ({ run }) => {
    // своё уведомление непрочитанным — не зависим от beforeEach
    await saveNotification(createNotification({ id: `q-${run.name}`, userId: 'owner-test' }))

    const setItem = vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {
      throw new DOMException('quota', 'QuotaExceededError')
    })

    try {
      await expect(run('owner-test')).rejects.toThrow('Не хватает места')
    } finally {
      setItem.mockRestore()
    }

    const items = await getNotifications()
    expect(items.some((item) => item.id === `q-${run.name}`)).toBe(true)
    expect(items).toContainEqual(other)
  })
  // ---
  it('одиночное чтение сохраняется и не меняет чужую запись', async () => {
    await markNotificationRead(own.id)
    expect(await getNotifications()).toContainEqual({ ...own, isRead: true })
    expect(await getNotifications()).toContainEqual(other)
  })

  it('после перезагрузки модулей чтение и очистка не теряются', async () => {
    await markAllNotificationsRead(own.userId)
    vi.resetModules()
    const afterRead = await import('./notificationApi')
    expect(await afterRead.getNotifications()).toContainEqual({ ...own, isRead: true })
    await afterRead.clearNotifications(own.userId)
    vi.resetModules()
    const afterClear = await import('./notificationApi')
    const items = await afterClear.getNotifications()
    expect(items.some((item) => item.userId === own.userId)).toBe(false)
    expect(items).toContainEqual(other)
  })
})

describe('ensureExchangeNotification', () => {
  it('возвращает прочитанную запись с другим id без повторной записи и не меняет дату', async () => {
    const read = createNotification({
      id: 'existing-read',
      userId: 'ensure-owner',
      exchangeId: 'ensure-exchange',
      isRead: true,
    })
    await saveNotification(read)
    const write = vi.spyOn(Storage.prototype, 'setItem')
    try {
      expect(await ensureExchangeNotification({ ...read, id: 'new', isRead: false })).toEqual(read)
      expect(write).not.toHaveBeenCalled()
    } finally {
      write.mockRestore()
    }
  })

  it('параллельный повтор возвращает одну запись и не объединяет разных владельцев', async () => {
    const notification = createNotification({
      id: 'ensure-one',
      userId: 'ensure-owner',
      exchangeId: 'ensure-exchange',
    })
    const result = await Promise.all([
      ensureExchangeNotification(notification),
      ensureExchangeNotification({ ...notification, id: 'ensure-two' }),
    ])
    expect(result).toEqual([notification, notification])
    const other = { ...notification, id: 'ensure-other', userId: 'another-owner' }
    expect(await ensureExchangeNotification(other)).toEqual(other)
    expect(
      (await getNotifications()).filter((item) => item.exchangeId === notification.exchangeId),
    ).toEqual([notification, other])
  })
})

it('прочитать все читает коллекцию один раз и возвращает также просмотренные', async () => {
  const read = createNotification({ id: 'already-read', userId: own.userId, isRead: true })
  await saveNotification(read)
  const spy = vi.spyOn(Storage.prototype, 'getItem')
  try {
    const items = await markAllNotificationsRead(own.userId)
    expect(items).toContainEqual(read)
    expect(items).toContainEqual({ ...own, isRead: true })
    expect(spy.mock.calls.filter(([key]) => key === 'skillswap_db_notifications')).toHaveLength(1)
  } finally {
    spy.mockRestore()
  }
})
