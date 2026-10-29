import type { ID, ISODateString } from '@/shared/types'

/**
 * Навык, которым пользователь готов поделиться («Может научить»).
 * @see Figma: «Страница навыка» — заголовок, категория / подкатегория, описание, галерея.
 */
export interface Skill {
  id: ID
  title: string
  description: string
  categoryId: ID
  subcategoryId: ID
  /** Фото для галереи на странице навыка */
  images: string[]
  authorId: ID
  createdAt: ISODateString
}
