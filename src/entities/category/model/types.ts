import type { ID } from '@/shared/types'

/** Подкатегория навыка, например «Игра на барабанах» → «Музыка и звук» */
export interface Subcategory {
  id: ID
  categoryId: ID
  title: string
}

/**
 * Категория навыков из меню «Все навыки» и фильтра «Навыки».
 * В макете: Бизнес и карьера, Творчество и искусство, Иностранные языки,
 * Образование и развитие, Здоровье и лайфстайл, Дом и уют.
 */
export interface Category {
  id: ID
  title: string
  /** Имя иконки из shared/assets/icons */
  icon: string
  /** Цвет чипов навыков этой категории */
  color: string
  subcategories: Subcategory[]
}
