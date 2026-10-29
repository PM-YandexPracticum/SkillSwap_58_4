import type { ReactNode } from 'react'
import type { User } from '@/entities/user'

export interface OffersCarouselProps {
  /** Похожие предложения: пользователи с навыками той же подкатегории */
  users: readonly User[]
  /**
   * Как отрисовать карточку. Страница передаёт сюда `OfferCard`:
   * виджет не может импортировать другой виджет (правило FSD).
   */
  renderItem: (user: User) => ReactNode
}

/**
 * Блок «Похожие предложения» на странице навыка: заголовок + shared/ui/Carousel на 4 карточки.
 * @see Figma: «Страница навыка» (1:2764)
 */
export function OffersCarousel(_props: OffersCarouselProps) {
  // TODO: <Carousel visibleCount={4} ariaLabel="Похожие предложения">{users.map(renderItem)}</Carousel>
  return null
}
