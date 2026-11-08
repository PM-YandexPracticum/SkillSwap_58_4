import { Fragment, useId, type ReactNode } from 'react'

import type { PublicUser } from '@/entities/user'
import { CATALOG } from '@/shared/config'
import { Carousel } from '@/shared/ui/Carousel'

import styles from './OffersCarousel.module.css'

export interface OffersCarouselProps {
  /** Похожие предложения: пользователи с навыками той же подкатегории */
  users: readonly PublicUser[]
  /**
   * Как отрисовать карточку. Страница передаёт сюда `OfferCard`:
   * виджет не может импортировать другой виджет (правило FSD).
   */
  renderItem: (user: PublicUser) => ReactNode
}

/**
 * Блок «Похожие предложения» на странице навыка: заголовок + shared/ui/Carousel на 4 карточки.
 * Если похожих предложений нет, блок не показывается.
 * @see Figma: «Страница навыка» (1:2764), карусель — 1:2812
 */
export function OffersCarousel({ users, renderItem }: OffersCarouselProps) {
  const titleId = useId()

  if (users.length === 0) return null

  return (
    <section aria-labelledby={titleId}>
      <h2 className={styles.title} id={titleId}>
        Похожие предложения
      </h2>
      <Carousel slidesToShow={CATALOG.SIMILAR_OFFERS_VISIBLE}>
        {users.map((user) => (
          <Fragment key={user.id}>{renderItem(user)}</Fragment>
        ))}
      </Carousel>
    </section>
  )
}
