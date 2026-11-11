import type { Category } from '@/entities/category'
import type { City } from '@/entities/city'
import type { Skill } from '@/entities/skill'
import type { PublicUser } from '@/entities/user'

/** Данные навыка, автора и справочников для `SkillDetails`. */
export interface SkillPageData {
  skill: Skill
  author: PublicUser
  cityName: string
  categoryTitle: string
  subcategoryTitle: string
  /** «Хочет научиться» автора: подкатегории с категорией (от неё цвет чипа) */
  learnSubcategories: Array<{ id: string; title: string; categoryId: string }>
}

export interface SkillPageSources {
  /** Навык и автор уже выбраны из Redux-состояния. */
  skill: Skill | undefined
  author: PublicUser | undefined
  categories: readonly Category[]
  cities: readonly City[]
}

/** Подпись города, если его нет в справочнике: так же, как на карточке предложения. */
const UNKNOWN_CITY = 'Город не указан'

/**
 * Собирает отображаемые данные страницы из сущностей, уже загруженных в Redux.
 * Сама функция ничего не загружает и не знает о компонентах страницы.
 * @returns данные страницы или null, если навык или его автор отсутствуют.
 */
export function buildSkillPageData({
  skill,
  author,
  categories,
  cities,
}: SkillPageSources): SkillPageData | null {
  if (!skill || !author) return null

  const category = categories.find((item) => item.id === skill.categoryId)
  const subcategory = category?.subcategories.find((item) => item.id === skill.subcategoryId)

  const learnSubcategories = author.learnSubcategoryIds.flatMap((id) => {
    const owner = categories.find((item) => item.subcategories.some((sub) => sub.id === id))
    const found = owner?.subcategories.find((sub) => sub.id === id)
    return owner && found ? [{ id: found.id, title: found.title, categoryId: owner.id }] : []
  })

  return {
    skill,
    author,
    cityName: cities.find((city) => city.id === author.cityId)?.name ?? UNKNOWN_CITY,
    categoryTitle: category?.title ?? '',
    subcategoryTitle: subcategory?.title ?? '',
    learnSubcategories,
  }
}
