import type { Notification } from '@/entities/notification'
import type { PublicUser } from '@/entities/user'
import { formatRecipientName } from '@/shared/lib/formatRecipientName'

import type { NotificationWithName } from '../model/types'

/**
 * Готовит уведомления для `NotificationsPanel`: оставляет только уведомления
 * текущего пользователя и добавляет `userName` в дательном падеже.
 *
 * Зачем нужен слой: `NotificationsPanel` по P3-15 «глупая» — она получает
 * готовый `NotificationWithName[]` и ничего не склоняет. Сборку и падеж
 * делает эта функция: склоняет через `formatRecipientName`, фильтрует по
 * владельцу (`userId === currentUserId`) и подставляет адресата по `toUserId`.
 *
 * Чужие уведомления отбрасываются даже если селектор их уже отфильтровал —
 * защита при смене пользователя без перезагрузки (ТЗ P7-05).
 *
 * @param notifications - «Сырые» уведомления из Redux (могут содержать чужие)
 * @param users - Все публичные пользователи; из них берём имя и пол адресата
 * @param currentUserId - id пользователя, чья сессия сейчас открыта
 * @returns Только уведомления `currentUserId`, у каждого — готовый `userName`
 * @see Figma: 1:2148
 */
export function buildNotificationsWithNames(
  notifications: Notification[],
  users: PublicUser[],
  currentUserId: string,
): NotificationWithName[] {
  const usersById = new Map(users.map((user) => [user.id, user]))

  return notifications
    .filter((notification) => notification.userId === currentUserId)
    .flatMap((notification) => {
      const recipient = usersById.get(notification.toUserId)

      if (!recipient) return []

      return [
        {
          ...notification,
          userName: formatRecipientName(recipient.name, recipient.gender),
        },
      ]
    })
}
