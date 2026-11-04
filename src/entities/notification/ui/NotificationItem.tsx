import IdeaIcon from '@/shared/assets/icons/idea.svg?react'
import { formatDate } from '@/shared/lib/helpers'
import { Button } from '@/shared/ui/Button'

import styles from './NotificationItem.module.css'

/** Подпись под заголовком — текст из макета 1:2148 */
const CAPTION = 'Перейдите в профиль, чтобы обсудить детали'

export interface NotificationItemProps {
  notification: import('../model/types').Notification
  /** Имя того, кому предложили обмен */
  userName: string
  onGo?: () => void
}

/**
 * Строка уведомления: иконка, «Вы предложили обмен {userName}», дата и кнопка «Перейти».
 * Кликабельна только кнопка; у прочитанного её нет.
 * @see Figma:  «Каталог -» (1:2148)
 */
export function NotificationItem({ notification, userName, onGo }: NotificationItemProps) {
  const { isRead, createdAt } = notification

  return (
    <article className={styles.item}>
      <div className={styles.row}>
        <div className={styles.main}>
          <IdeaIcon className={styles.icon} aria-hidden="true" focusable="false" />
          <div className={styles.text}>
            <p className={styles.title}>Вы предложили обмен {userName}</p>
            <p className={styles.caption}>{CAPTION}</p>
          </div>
        </div>
        <time className={styles.date} dateTime={createdAt}>
          {formatDate(createdAt)}
        </time>
      </div>
      {!isRead && (
        <Button variant="primary" onClick={onGo}>
          Перейти
        </Button>
      )}
    </article>
  )
}
