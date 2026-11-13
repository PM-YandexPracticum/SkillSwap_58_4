import { MarkAllReadButton } from '@/features/notifications-read'
import { NotificationItem } from '@/entities/notification'
import { Button } from '@/shared/ui/Button'

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

// NotificationWithName — см. ../model/types.ts
export type { NotificationWithName } from '../model/types'

export interface NotificationsPanelProps {
  /** Все уведомления: разделяются по isRead на новые и просмотренные */
  notifications: NotificationWithName[]
  /** «Прочитать все» — в P3-15 заглушка, в P7-05 dispatch */
  onMarkAllRead: () => void
  /** «Очистить» — в P3-15 заглушка, сохранение — P4-07 */
  onClear: () => void
  /** «Перейти» — ведёт к карточке навыка адресата; подключение в P7-05 */
  onGo: (id: string) => void
}

/**
 * Окно колокольчика: «Новые уведомления» + «Прочитать все», ниже «Просмотренные».
 * Уведомления номинальные: «Вы предложили обмен Ивану» + «Перейти» → страница навыка Ивана.
 * Просмотренные — без кнопки, не кликаются. Пусто — «Уведомлений пока нет».
 * Открытие окна управляется снаружи через Dropdown (align="end"), панель его не рисует.
 *
 * По P3-15 «Прочитать все» и «Очистить» — обычные кнопки без логики:
 * в stories и тестах передаём функции-заглушки. Сохранение прочтения — P4-07,
 * подключение к шапке — P7-05.
 *
 * @see Figma: 1:2190 (окно), 1:2148 (экран с открытой панелью)
 */
export function NotificationsPanel({
  notifications,
  onMarkAllRead,
  onClear,
  onGo,
}: NotificationsPanelProps) {
  const unread = notifications.filter((notification) => !notification.isRead)
  const read = notifications.filter((notification) => notification.isRead)
  const isEmpty = notifications.length === 0

  return (
    <div className={styles.panel}>
      {isEmpty ? (
        <p className={styles.empty}>{EMPTY_TEXT}</p>
      ) : (
        <>
          {unread.length > 0 && (
            <section className={styles.section}>
              <header className={styles.header}>
                <h2 className={styles.title}>{TITLE_NEW}</h2>
                <div className={styles.actionButton}>
                  <MarkAllReadButton onClick={onMarkAllRead} />
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
                  <Button variant="ghost" onClick={onClear}>
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
