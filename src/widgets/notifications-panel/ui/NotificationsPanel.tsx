import { MarkAllReadButton } from '@/features/notifications-read'
import { NotificationItem } from '@/entities/notification'
import { Button } from '@/shared/ui/Button'
import { EmptyState } from '@/shared/ui/EmptyState'
import { Loader } from '@/shared/ui/Loader'
import type { LoadingStatus } from '@/shared/types'
import type { NotificationWithName } from '../model/types'

import styles from './NotificationsPanel.module.css'

/** Заголовок раздела новых уведомлений */
const TITLE_NEW = 'Новые уведомления'

/** Заголовок раздела просмотренных */
const TITLE_READ = 'Просмотренные'

/** Кнопка «Очистить» у просмотренных */
const BUTTON_CLEAR = 'Очистить'

/** Пустое состояние */
const EMPTY_TEXT = 'Уведомлений пока нет'

/** Кнопка повтора при ошибке загрузки */
const BUTTON_RETRY = 'Повторить'

export type { NotificationWithName } from '../model/types'

export interface NotificationsPanelProps {
  notifications: NotificationWithName[]
  status?: LoadingStatus
  loadError?: string | null
  actionError?: string | null
  onRetry?: () => void
  onMarkAllRead: () => void
  onClear: () => void
  onGo: (id: string) => void
}

export function NotificationsPanel({
  notifications,
  status = 'succeeded',
  loadError = null,
  actionError = null,
  onRetry,
  onMarkAllRead,
  onClear,
  onGo,
}: NotificationsPanelProps) {
  const unread = notifications.filter((notification) => !notification.isRead)
  const read = notifications.filter((notification) => notification.isRead)

  const isEmpty = status === 'succeeded' && notifications.length === 0
  const isLoadFailed = loadError !== null
  const isFirstLoading = status === 'loading' && notifications.length === 0

  return (
    <div className={styles.panel}>
      {isLoadFailed ? (
        <div className={styles.error} role="alert">
          <p className={styles.errorText}>{loadError}</p>
          {onRetry && (
            <Button variant="secondary" onClick={onRetry} disabled={status === 'loading'}>
              {BUTTON_RETRY}
            </Button>
          )}
        </div>
      ) : isFirstLoading ? (
        <div className={styles.loading}>
          <Loader />
        </div>
      ) : isEmpty ? (
        <EmptyState compact title={EMPTY_TEXT} />
      ) : (
        <>
          {actionError && (
            <p className={styles.actionError} role="alert">
              {actionError}
            </p>
          )}

          {unread.length > 0 && (
            <section className={styles.section}>
              <header className={styles.header}>
                <h2 className={styles.title}>{TITLE_NEW}</h2>
                <div className={styles.actionButton}>
                  <MarkAllReadButton onClick={onMarkAllRead} disabled={status === 'loading'} />
                </div>
              </header>
              <ul className={styles.list}>
                {unread.map((notification) => (
                  <li key={notification.id}>
                    <NotificationItem
                      notification={notification}
                      userName={notification.userName}
                      onGo={() => onGo(notification.id)}
                    />
                  </li>
                ))}
              </ul>
            </section>
          )}

          {read.length > 0 && (
            <section className={styles.section}>
              <header className={styles.header}>
                <h2 className={styles.title}>{TITLE_READ}</h2>
                <div className={styles.actionButton}>
                  <Button variant="ghost" onClick={onClear} disabled={status === 'loading'}>
                    {BUTTON_CLEAR}
                  </Button>
                </div>
              </header>
              <ul className={styles.list}>
                {read.map((notification) => (
                  <li key={notification.id}>
                    <NotificationItem
                      notification={notification}
                      userName={notification.userName}
                    />
                  </li>
                ))}
              </ul>
            </section>
          )}
        </>
      )}
    </div>
  )
}
