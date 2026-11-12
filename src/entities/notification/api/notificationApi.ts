import { createMockCollection, isISODateString, isRecord, isString, loadSeed } from '@/shared/api'
import type { Notification } from '../model/types'

const isNotification = (value: unknown): value is Notification =>
  isRecord(value) &&
  isString(value.id) &&
  isString(value.userId) &&
  isString(value.toUserId) &&
  isString(value.exchangeId) &&
  typeof value.isRead === 'boolean' &&
  isISODateString(value.createdAt)

/** Хранилище уведомлений. Переход на настоящую БД — меняется только этот файл. */
const notifications = createMockCollection<Notification>(
  'notifications',
  loadSeed<Notification>('notifications', isNotification),
  { validate: isNotification },
)

// Массовые операции и создание не перемешиваются: очистка не удаляет записи, пришедшие после неё.
let operationQueue: Promise<unknown> = Promise.resolve()
function enqueue<T>(operation: () => Promise<T>): Promise<T> {
  const result = operationQueue.then(operation)
  operationQueue = result.catch(() => undefined)
  return result
}

/** Все уведомления (фильтр по текущему пользователю — в селекторах). */
export function getNotifications(): Promise<Notification[]> {
  return enqueue(() => notifications.getAll())
}

/** Новое уведомление «Вы предложили обмен …». Данные копируются до ожидания очереди. */
export function createNotification(notification: Notification): Promise<Notification> {
  const input = { ...notification }
  return enqueue(() => notifications.create(input))
}

/** Отметить одно уведомление прочитанным; для кнопки «Прочитать все» — markAllRead в model. */
export function markNotificationRead(id: string): Promise<Notification> {
  return enqueue(() => notifications.update(id, { isRead: true }))
}

/** Прочитать новые уведомления владельца. Возвращает полный список владельца, включая уже просмотренные. */
export function markAllNotificationsRead(userId: string): Promise<Notification[]> {
  return enqueue(async () => {
    const items = (await notifications.getAll()).filter((item) => item.userId === userId)
    for (const item of items.filter((item) => !item.isRead)) {
      await notifications.update(item.id, { isRead: true })
    }
    return items.map((item) => ({ ...item, isRead: true }))
  })
}

/** Удалить новые и просмотренные уведомления владельца. Возвращает удалённые id. */
export function clearNotifications(userId: string): Promise<string[]> {
  return enqueue(async () => {
    const items = (await notifications.getAll()).filter((item) => item.userId === userId)
    for (const item of items) await notifications.remove(item.id)
    return items.map((item) => item.id)
  })
}
