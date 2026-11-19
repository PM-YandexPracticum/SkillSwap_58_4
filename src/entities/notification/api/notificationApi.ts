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

// Каждая операция атомарна и использует общую очередь createMockCollection.

/** Все уведомления (фильтр по текущему пользователю — в селекторах). */
export function getNotifications(): Promise<Notification[]> {
  return notifications.getAll()
}

/** Новое уведомление «Вы предложили обмен …». Данные копируются до ожидания очереди. */
export function createNotification(notification: Notification): Promise<Notification> {
  const input = { ...notification }
  return notifications.create(input)
}

/**
 * Сохранить уведомление обмена или вернуть существующее (в том числе прочитанное).
 * Проверка и создание выполняются одним действием коллекции; список не передаётся в feature.
 */
export function ensureExchangeNotification(notification: Notification): Promise<Notification> {
  const input = { ...notification }
  return notifications.createIfAbsent(input, (item) =>
    JSON.stringify([item.userId, item.exchangeId]),
  )
}

/** Отметить одно уведомление прочитанным; для кнопки «Прочитать все» — markAllRead в model. */
export function markNotificationRead(id: string): Promise<Notification> {
  return notifications.update(id, { isRead: true })
}

/**
 * Отметить все уведомления владельца прочитанными одним пакетным запросом.
 * Фильтр `userId` уходит в changes для `updateMany` — чужие уведомления не затрагиваются.
 * У уже прочитанных `isRead` не меняется: в `changes` они не попадают,
 * поэтому `updateMany` не делает лишний setItem, когда новых нет.
 * Возвращает полный список владельца, включая уже просмотренные (как и раньше).
 * P7-05: пакетная операция mock DB — одно чтение, одна запись, одна задержка.
 */
export function markAllNotificationsRead(userId: string): Promise<Notification[]> {
  return notifications.updateMany(
    (items) =>
      items
        .filter((item) => item.userId === userId && !item.isRead)
        .map((item) => ({ id: item.id, changes: { isRead: true } })),
    (items) => items.filter((item) => item.userId === userId),
  )
}

/**
 * Удалить новые и просмотренные уведомления владельца одним обращением к «базе».
 * Чужие записи не удаляются: фильтр по владельцу уходит в removeMany.
 * Возвращает id удалённых уведомлений.
 * P7-05: пакетная операция mock DB — одно чтение, одна запись, одна задержка.
 */
export function clearNotifications(userId: string): Promise<string[]> {
  return notifications.removeMany((item) => item.userId === userId)
}
