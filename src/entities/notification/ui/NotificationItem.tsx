import IdeaIcon from '@/shared/assets/icons/idea.svg?react'
import { formatDate } from '@/shared/lib/helpers'
import { Button } from '@/shared/ui/Button'

import styles from './NotificationItem.module.css'

import type { Notification } from '../model/types'

/** Подпись под заголовком уведомления */
const CAPTION = 'Перейдите в профиль, чтобы обсудить детали'

export interface NotificationItemProps {
  notification: Notification
  /**
   * Имя пользователя уже в нужной форме для фразы: «Ивану», «Анне».
   * Склонение — ответственность того, кто передаёт пропс; компонент имя не меняет.
   */
  userName: string
  onGo?: () => void
}

/**
 * Строка уведомления: иконка, «Вы предложили обмен {userName}», дата и кнопка «Перейти».
 * Кликабельна только кнопка; у прочитанного её нет.
 * @see Figma: 1:2190 (окно уведомлений), 1:2148 (экран с открытой панелью)
 */
export function NotificationItem({ notification, userName, onGo }: NotificationItemProps) {
  const { isRead, createdAt } = notification
  const title = `Вы предложили обмен ${userName}`

  return (
    <article className={styles.item}>
      <div className={styles.row}>
        <div className={styles.main}>
          <IdeaIcon className={styles.icon} aria-hidden="true" focusable="false" />
          <div className={styles.text}>
            <p className={styles.title}>{title}</p>
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
          <span className={styles.visuallyHidden}>— {title}</span>
        </Button>
      )}
    </article>
  )
}
