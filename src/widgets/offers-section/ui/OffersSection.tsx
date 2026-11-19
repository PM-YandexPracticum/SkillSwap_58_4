import { useId, useState, type ReactNode, type Ref } from 'react'

import type { PublicUser } from '@/entities/user'
import ChevronRight from '@/shared/assets/icons/chevron-right.svg?react'
import { CATALOG } from '@/shared/config'
import { Loader } from '@/shared/ui/Loader'

import styles from './OffersSection.module.css'

export interface OffersSectionProps {
  title: string
  /** Дополнительное действие заголовка, например сортировка результатов. */
  headerAction?: ReactNode
  users: ReadonlyArray<PublicUser>
  /** `expandable` — 3 ⇄ 9; `infinite` — все переданные карточки, порцию задаёт страница */
  mode: 'expandable' | 'infinite'
  /** Карточку передаёт страница: виджет не импортирует другой виджет */
  renderItem: (user: PublicUser) => ReactNode
  /** Только `infinite`: показать спиннер под сеткой, пока догружается порция. */
  isLoading?: boolean
  /** Только `infinite`: есть ещё карточки — выводим маркер конца ленты. */
  hasMore?: boolean
  /** Только `infinite`: ref маркера из `useInfiniteScroll`. */
  sentinelRef?: Ref<HTMLDivElement>
}

/**
 * Сетка по три карточки. «Популярное» и «Новое» плавно раскрываются с 3 до 9 и обратно.
 * Секции независимы. В режиме ленты показывает переданные карточки, а под сеткой —
 * спиннер догрузки и пустой маркер конца ленты; саму догрузку выполняет страница.
 * @see Figma: «Популярное» (1:2872), «Новое» (1:2880), «Рекомендуем» (1:2888)
 */
export function OffersSection({
  title,
  users,
  mode,
  renderItem,
  headerAction,
  isLoading = false,
  hasMore = false,
  sentinelRef,
}: OffersSectionProps) {
  const infinite = mode === 'infinite'
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
        {headerAction}
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
      {infinite && isLoading && (
        <div className={styles.loading}>
          <Loader />
        </div>
      )}
      {infinite && hasMore && sentinelRef && (
        <div ref={sentinelRef} className={styles.sentinel} aria-hidden="true" />
      )}
    </section>
  )
}
