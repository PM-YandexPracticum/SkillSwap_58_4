import type { PublicUser } from '@/entities/user'

export interface OfferCardProps {
  /** Автор предложения — без пароля. Город, навык и подкатегории для UserCard виджет берёт из store по его id */
  user: PublicUser
}

/**
 * Карточка в каталоге: UserCard + FavoriteButton со счётчиком лайков + «Подробнее» → `/skill/:id`.
 * Если текущий пользователь уже предложил этому человеку обмен — вместо «Подробнее» бейдж «Обмен предложен».
 * @see Figma: 1:2861, 1:2106
 */
export function OfferCard(_props: OfferCardProps) {
  // TODO: реализовать по макету
  return null
}
