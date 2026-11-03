import type { PublicUser } from '../model/types'
import type { UserCardTag } from './UserCard'

export interface UserProfileCardProps {
  user: PublicUser
  /** Название города из справочника — сама карточка города не знает */
  cityName: string
  /** «Может научить»: своё название навыка и его категория */
  teachSkill: UserCardTag
  /** «Хочет научиться»: подкатегории пользователя с категорией (от неё цвет чипа) */
  learnSubcategories: ReadonlyArray<UserCardTag & { id: string }>
}

/**
 * Расширенная карточка автора на странице навыка: блок `UserSummary` (аватар, имя, «город, возраст»),
 * «О себе» (только если заполнено — `user.about`) и чипы навыков, как в UserCard.
 * Данные о городе, навыке и подкатегориях приходят пропсами — их соберёт страница навыка (P3-09, P7-01) селекторами P4-02.
 * Образец устройства, stories и тестов — UserCard (P3-01).
 * @see Figma: «Страница навыка» (1:2764), левая колонка
 */
export function UserProfileCard(_props: UserProfileCardProps) {
  // TODO: реализовать по макету (P3-02)
  return null
}
