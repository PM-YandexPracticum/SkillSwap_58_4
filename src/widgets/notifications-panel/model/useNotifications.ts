import { useCallback, useEffect, useMemo, useRef } from 'react'
import {
  fetchNotifications,
  selectNotifications,
  selectNotificationsError,
  selectNotificationsLoadError,
  selectNotificationsStatus,
} from '@/entities/notification'
import { selectSession } from '@/entities/session'
import { selectUsers } from '@/entities/user'
import { useAppDispatch, useAppSelector } from '@/shared/lib/store'
import type { LoadingStatus } from '@/shared/types'
import { buildNotificationsWithNames } from '../lib/buildNotificationsWithNames'
import type { NotificationWithName } from './types'

export interface UseNotificationsResult {
  notifications: NotificationWithName[]
  status: LoadingStatus
  /** Ошибка последнего действия; первоначальная загрузка также выделена в loadError. */
  error: string | null
  /** Ошибка загрузки списка: панель показывает её вместе с ручным повтором. */
  loadError: string | null
  retry: () => void
}

/**
 * Загружает уведомления независимо от открытия панели и DataProvider.
 * Одна автоматическая попытка на сессию; после ошибки — только явный повтор.
 * Селектор ограничивает список владельцем, UI получает готовые имена.
 * @see Figma: 1:2148
 */
export function useNotifications(): UseNotificationsResult {
  const dispatch = useAppDispatch()
  const session = useAppSelector(selectSession)
  const items = useAppSelector(selectNotifications)
  const users = useAppSelector(selectUsers)
  const status = useAppSelector(selectNotificationsStatus)
  const error = useAppSelector(selectNotificationsError)
  const loadError = useAppSelector(selectNotificationsLoadError)
  const attemptedSession = useRef<string | null>(null)
  const sessionKey = session ? JSON.stringify([session.userId, session.token]) : null

  const retry = useCallback(() => {
    void dispatch((dispatch, getState) => {
      const state = getState()
      if (!state.session.session || state.notifications.pendingRequests > 0) return
      return dispatch(fetchNotifications())
    })
  }, [dispatch])

  useEffect(() => {
    if (!sessionKey) {
      attemptedSession.current = null
      return
    }
    if (attemptedSession.current === sessionKey || status === 'loading') return
    attemptedSession.current = sessionKey
    if (status !== 'succeeded') retry()
  }, [sessionKey, status, retry])

  const notifications = useMemo(() => buildNotificationsWithNames(items, users), [items, users])
  return { notifications, status, error, loadError, retry }
}
