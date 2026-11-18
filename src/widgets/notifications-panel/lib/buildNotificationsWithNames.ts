import type { Notification } from '@/entities/notification'
import type { PublicUser } from '@/entities/user'
import { formatRecipientName } from '@/shared/lib/formatRecipientName'
import type { NotificationWithName } from '../model/types'

/**
 * Добавляет готовое имя к уже отобранным селектором уведомлениям владельца.
 * Отсутствующий адресат не скрывает запись и не создаёт расхождение с точкой.
 */
export function buildNotificationsWithNames(
  notifications: Notification[],
  users: PublicUser[],
): NotificationWithName[] {
  const usersById = new Map(users.map((user) => [user.id, user]))
  return notifications.map((notification) => {
    const recipient = usersById.get(notification.toUserId)
    return {
      ...notification,
      userName: recipient ? formatRecipientName(recipient.name, recipient.gender) : 'пользователю',
    }
  })
}
