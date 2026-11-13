import {
  selectHasUnread,
  selectNotifications,
  selectNotificationsError,
  selectNotificationsStatus,
} from '@/entities/notification'
import { selectSession } from '@/entities/session'
import { selectUsers } from '@/entities/user'
import { useAppSelector } from '@/shared/lib/store'

import { buildNotificationsWithNames } from '../lib/buildNotificationsWithNames'
import type { NotificationWithName } from './types'

/** Что получает панель уведомлений через пропсы при подключении в `MainLayout` (P7-05). */
export interface UseNotificationsResult {
  /** Уведомления только текущего пользователя + `userName` в дательном падеже. */
  notifications: NotificationWithName[]
  /** Есть ли непрочитанные — индикатор «красная точка» на колокольчике. */
  hasUnread: boolean
  /** Идёт ли операция с уведомлениями (загрузка, «Прочитать все», «Очистить»). */
  isLoading: boolean
  /** Понятная ошибка операции или `null`. При ошибке не показываем ложный успех. */
  error: string | null
}

/**
 * Хук. Готовит данные для панели уведомлений: `NotificationWithName[]` и флаг
 * непрочитанных. Действия («Прочитать все», «Очистить», «Перейти») остаются
 * снаружи — в `MainLayout`, где нужны `dispatch`/`navigate`.
 *
 * Почему не отдаём `selectNotifications` напрямую: селектор возвращает
 * `Notification[]` без `userName`, а панель по P3-15 «глупая» и склонять
 * имя сама не умеет — склонение делает `buildNotificationsWithNames`.
 *
 * @see Figma: 1:2148
 * @see docs/requirements/tz.md — P7-05
 */
export function useNotifications(): UseNotificationsResult {
  const session = useAppSelector(selectSession)
  const notifications = useAppSelector(selectNotifications)
  const users = useAppSelector(selectUsers)
  const hasUnread = useAppSelector(selectHasUnread)
  const status = useAppSelector(selectNotificationsStatus)
  const error = useAppSelector(selectNotificationsError)

  const currentUserId = session?.userId

  return {
    notifications: currentUserId
      ? buildNotificationsWithNames(notifications, users, currentUserId)
      : [],
    hasUnread,
    isLoading: status === 'loading',
    error,
  }
}
