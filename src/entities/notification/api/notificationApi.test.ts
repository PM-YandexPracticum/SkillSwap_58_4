import { createNotification } from '../testing'
import {
  createNotification as saveNotification,
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
