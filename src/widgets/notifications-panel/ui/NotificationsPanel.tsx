import { MarkAllReadButton } from '@/features/notifications-read'
import { NotificationItem } from '@/entities/notification'
import { Button } from '@/shared/ui/Button'
import { EmptyState } from '@/shared/ui/EmptyState'
import { Loader } from '@/shared/ui/Loader'
import type { LoadingStatus } from '@/shared/types'

import styles from './NotificationsPanel.module.css'

import type { NotificationWithName } from '../model/types'

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

// NotificationWithName — см. ../model/types.ts
export type { NotificationWithName } from '../model/types'

export interface NotificationsPanelProps {
  /** Все уведомления: разделяются по isRead на новые и просмотренные */
  notifications: NotificationWithName[]
  /**
   * Статус загрузки. «Уведомлений пока нет» показываем только при 'succeeded':
   * иначе пустой список при загрузке или ошибке выглядел бы как «уведомлений нет».
   */
  status?: LoadingStatus
  /**
   * Ошибка первоначальной загрузки — показываем вместо списка вместе с кнопкой «Повторить».
   * Текст берётся из `DATA_ERRORS`, в компоненте не дублируется.
   */
  loadError?: string | null
  /**
   * Ошибка операции («Прочитать все» / «Очистить»). Показывается баннером над списком,
   * сам список не скрывает: повтора у неё нет.
   */
  actionError?: string | null
  /** Повтор первоначальной загрузки. Пока статус 'loading' — кнопка недоступна. */
  onRetry?: () => void
  /** Прочтение новых уведомлений; MainLayout передаёт обработчик Redux. */
  onMarkAllRead: () => void
  /** Удаление всех уведомлений владельца; MainLayout передаёт обработчик Redux. */
  onClear: () => void
  /** «Перейти» — id уведомления для навигации к навыку адресата. */
  onGo: (id: string) => void
}

/**
 * Окно колокольчика: «Новые уведомления» + «Прочитать все», ниже «Просмотренные».
 * Уведомления номинальные: «Вы предложили обмен Ивану» + «Перейти» → страница навыка Ивана.
 * Просмотренные — без кнопки, не кликаются. Пусто — «Уведомлений пока нет».
 * Пустое сообщение выводит общий EmptyState в компактном режиме без действия.
 * Открытие окна управляется снаружи через Dropdown (align="end"), панель его не рисует.
 *
 * Данные, статусы и действия передаёт MainLayout; stories используют заглушки.
 * Во время операции повторное действие недоступно; ошибка не скрывает сохранённый список.
 *
 * @see Figma: 1:2190 (окно), 1:2148 (экран с открытой панелью)
 */
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
  // «Пусто» — правда только после успешной загрузки.
  const isEmpty = status === 'succeeded' && notifications.length === 0
  // Ошибка загрузки важнее статуса: если она есть — показываем её и не ждём статуса.
  const isLoadFailed = loadError !== null
  // Пока идёт первая загрузка — спиннер вместо (ложного) пустого списка.
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
