import { findSubcategories, type Category } from '@/entities/category'
import { getCityName, type City } from '@/entities/city'
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

  return {
    skill,
    author,
    cityName: getCityName(cities, author.cityId),
    categoryTitle: category?.title ?? '',
    subcategoryTitle: subcategory?.title ?? '',
    learnSubcategories: findSubcategories(categories, author.learnSubcategoryIds),
  }
}
