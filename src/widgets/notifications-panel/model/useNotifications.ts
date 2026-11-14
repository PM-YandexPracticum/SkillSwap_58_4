import { useCallback, useEffect, useRef } from 'react'

import {
  fetchNotifications,
  selectHasUnread,
  selectNotifications,
  selectNotificationsError,
  selectNotificationsLoadError,
  selectNotificationsStatus,
} from '@/entities/notification'
import { selectSession } from '@/entities/session'
import { selectUsers } from '@/entities/user'
import { useAppDispatch, useAppSelector } from '@/shared/lib/store'

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
  /**
   * Ошибка именно первоначальной загрузки — по ней окно показывает «Повторить».
   * `null`, когда загрузка ещё не падала или уже успешно повторилась.
   */
  loadError: string | null
  /** Ручной повтор загрузки после ошибки. Пока идёт загрузка — ничего не делает. */
  retry: () => void
}

/**
 * Хук. Готовит данные для панели уведомлений и сам загружает их при входе.
 * Действия («Прочитать все», «Очистить», «Перейти») остаются снаружи — в
 * `MainLayout`, где нужны `dispatch`/`navigate`.
 *
 * Загрузка не входит в DataProvider: она своя, у неё своя ошибка и повтор.
 * Повторного запроса нет, если статус уже loading/succeeded; после ошибки
 * доступен один явный повтор — `retry()`. Ошибка загрузки возвращается
 * отдельно (`loadError`), чтобы панель показала «Повторить» только для неё,
 * а ошибки «Прочитать все» / «Очистить» — баннером без повтора.
 *
 * @see Figma: 1:2148
 * @see docs/requirements/tz.md — P7-05
 */
export function useNotifications(): UseNotificationsResult {
  const dispatch = useAppDispatch()
  const session = useAppSelector(selectSession)
  const notifications = useAppSelector(selectNotifications)
  const users = useAppSelector(selectUsers)
  const hasUnread = useAppSelector(selectHasUnread)
  const status = useAppSelector(selectNotificationsStatus)
  const error = useAppSelector(selectNotificationsError)
  const loadError = useAppSelector(selectNotificationsLoadError)

  /** Отметка «запрос уже запускали» — без ререндера, чтобы не зациклить эффект. */
  const requestedRef = useRef(false)

  const currentUserId = session?.userId

  useEffect(() => {
    // Гость — ничего не грузим и сбрасываем отметку для следующего входа.
    if (!currentUserId) {
      requestedRef.current = false
      return
    }
    // Уже грузили при этом пользователе — второй запрос не нужен.
    if (requestedRef.current) return
    requestedRef.current = true
    // Статус читаем в момент dispatch: StrictMode не даст второй запрос.
    void dispatch((_, getState) => {
      const { status: currentStatus } = getState().notifications
      if (currentStatus === 'loading' || currentStatus === 'succeeded') return
      return dispatch(fetchNotifications())
    })
  }, [dispatch, currentUserId])

  const retry = useCallback(() => {
    if (status === 'loading') return
    void dispatch(fetchNotifications())
  }, [dispatch, status])

  return {
    notifications: currentUserId
      ? buildNotificationsWithNames(notifications, users, currentUserId)
      : [],
    hasUnread,
    isLoading: status === 'loading',
    error,
    loadError,
    retry,
  }
}
