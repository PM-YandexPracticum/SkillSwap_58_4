import type { ReactNode } from 'react'

import { pluralize } from '@/shared/lib/pluralize'
import { Avatar } from '@/shared/ui/Avatar'

import { getAge } from '../lib/getAge'
import type { PublicUser } from '../model/types'
import styles from './UserSummary.module.css'

export interface UserSummaryProps {
  user: PublicUser
  /** Название города из справочника */
  cityName: string
  /** Слот справа сверху — лайк со счётчиком */
  action?: ReactNode
}

const YEARS = ['год', 'года', 'лет'] as const

/**
 * Блок «аватар + имя + город, возраст». Общий для карточки в каталоге (UserCard)
 * и карточки автора на странице навыка (UserProfileCard, P3-02).
 * Длинное имя и город обрезаются многоточием. Слот действия висит в правом верхнем углу напротив имени:
 * место под него оставлено только у строки с именем, строка «город, возраст» проходит под ним, как в макете.
 * @see Figma: карточка Ивана (1:2877), блок `User`
 */
export function UserSummary({ user, cityName, action }: UserSummaryProps) {
  const age = getAge(user.birthDate)

  return (
    <div className={action ? `${styles.summary} ${styles.withAction}` : styles.summary}>
      <Avatar src={user.avatarUrl} alt={user.name} size="md" />
      <div className={styles.text}>
        <h3 className={styles.name}>{user.name}</h3>
        <p className={styles.meta}>
          {cityName}, {age} {pluralize(age, YEARS)}
        </p>
      </div>
      {action && <div className={styles.action}>{action}</div>}
    </div>
  )
}
