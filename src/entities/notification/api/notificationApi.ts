import { createMockCollection, loadSeed } from '@/shared/api'
import type { Notification } from '../model/types'

/**
 * Хранилище уведомлений.
 * Единственное место, которое знает, откуда берутся данные. Переход на настоящую БД — меняется только этот файл.
 */
const notifications = createMockCollection<Notification>(
  'notifications',
  loadSeed<Notification>('notifications'),
)

/** Все уведомления (фильтр по текущему пользователю — в селекторах) */
export function getNotifications(): Promise<Notification[]> {
  return notifications.getAll()
}

/** Новое уведомление «Вы предложили обмен …» */
export function createNotification(notification: Notification): Promise<Notification> {
  return notifications.create(notification)
}

/** Отметить уведомление прочитанным («Прочитать все» вызывает для каждого нового) */
export function markNotificationRead(id: string): Promise<Notification> {
  return notifications.update(id, { isRead: true })
}
