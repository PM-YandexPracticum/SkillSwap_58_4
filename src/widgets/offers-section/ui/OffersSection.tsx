import { useId, useState, type ReactNode } from 'react'

import type { PublicUser } from '@/entities/user'
import ChevronRight from '@/shared/assets/icons/chevron-right.svg?react'
import { CATALOG } from '@/shared/config'

import styles from './OffersSection.module.css'

export interface OffersSectionProps {
  title: string
  users: ReadonlyArray<PublicUser>
  /** `expandable` — 3 ⇄ 9; `infinite` — все переданные карточки, догрузка подключается в P5-06 */
  mode: 'expandable' | 'infinite'
  /** Карточку передаёт страница: виджет не импортирует другой виджет */
  renderItem: (user: PublicUser) => ReactNode
}

/**
 * Сетка по три карточки. «Популярное» и «Новое» плавно раскрываются с 3 до 9 и обратно.
 * Секции независимы; в режиме ленты показывает все переданные карточки без собственной загрузки.
 * @see Figma: «Популярное» (1:2872), «Новое» (1:2880), «Рекомендуем» (1:2888)
 */
export function OffersSection({ title, users, mode, renderItem }: OffersSectionProps) {
  const id = useId()
  const [expanded, setExpanded] = useState(false)
  const expandable = mode === 'expandable' && users.length > CATALOG.SECTION_COLLAPSED
  const visibleUsers = mode === 'expandable' ? users.slice(0, CATALOG.SECTION_COLLAPSED) : users
  const extraUsers = users.slice(CATALOG.SECTION_COLLAPSED, CATALOG.SECTION_EXPANDED)

  return (
    <section className={styles.section} aria-labelledby={`${id}-title`}>
      <div className={styles.header}>
        <h2 className={styles.title} id={`${id}-title`}>
          {title}
        </h2>
        {expandable && (
          <button
            className={styles.toggle}
            type="button"
            aria-expanded={expanded}
            aria-controls={`${id}-extra`}
            onClick={() => setExpanded((value) => !value)}
          >
            {expanded ? 'Свернуть' : 'Смотреть все'}
            <ChevronRight
              className={expanded ? styles.chevronUp : styles.chevron}
              aria-hidden="true"
            />
          </button>
        )}
      </div>
      <div className={styles.cards}>
        {visibleUsers.map((user) => (
          <div key={user.id}>{renderItem(user)}</div>
        ))}
      </div>
      {expandable && (
        <div
          id={`${id}-extra`}
          className={expanded ? `${styles.fold} ${styles.expanded}` : styles.fold}
          aria-hidden={!expanded}
          // React 18 не передаёт inert как boolean-проп. Атрибут исключает скрытые ссылки из Tab.
          ref={(node) => node?.toggleAttribute('inert', !expanded)}
        >
          <div className={styles.foldContent}>
            <div className={`${styles.cards} ${styles.extraCards}`}>
              {extraUsers.map((user) => (
                <div key={user.id}>{renderItem(user)}</div>
              ))}
            </div>
          </div>
        </div>
      )}
    </section>
  )
}
