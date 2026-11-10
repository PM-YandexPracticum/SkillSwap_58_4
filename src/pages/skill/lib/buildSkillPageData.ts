import type { Category } from '@/entities/category'
import type { City } from '@/entities/city'
import type { Skill } from '@/entities/skill'
import type { PublicUser, User } from '@/entities/user'

/** Всё, что нужно странице навыка: пропсы для `SkillDetails` и список для «Похожих предложений» */
export interface SkillPageData {
  skill: Skill
  author: PublicUser
  cityName: string
  categoryTitle: string
  subcategoryTitle: string
  /** «Хочет научиться» автора: подкатегории с категорией (от неё цвет чипа) */
  learnSubcategories: Array<{ id: string; title: string; categoryId: string }>
  /** Другие пользователи, чей навык из той же подкатегории; без автора и без пароля */
  similarUsers: PublicUser[]
}

export interface SkillPageSources {
  skillId: string
  skills: readonly Skill[]
  users: readonly User[]
  categories: readonly Category[]
  cities: readonly City[]
}

/** Подпись города, если его нет в справочнике: так же, как на карточке предложения */
const UNKNOWN_CITY = 'Город не указан'

/** Убирает пароль: в UI уходит только `PublicUser` */
function toPublicUser(user: User): PublicUser {
  const publicUser: Partial<User> = { ...user }
  delete publicUser.password
  return publicUser as PublicUser
}

/**
 * Собирает данные страницы навыка из ответов `entities/*\/api`. Пока в store нет селекторов навыка (P4-03),
 * страница берёт данные так; в фазах 4–7 эту функцию заменят селекторы.
 * @returns данные страницы или null, если навыка или его автора нет
 */
export function buildSkillPageData({
  skillId,
  skills,
  users,
  categories,
  cities,
}: SkillPageSources): SkillPageData | null {
  const skill = skills.find((item) => item.id === skillId)
  if (!skill) return null

  const authorRecord = users.find((user) => user.id === skill.authorId)
  if (!authorRecord) return null

  const category = categories.find((item) => item.id === skill.categoryId)
  const subcategory = category?.subcategories.find((item) => item.id === skill.subcategoryId)

  const learnSubcategories = authorRecord.learnSubcategoryIds.flatMap((id) => {
    const owner = categories.find((item) => item.subcategories.some((sub) => sub.id === id))
    const found = owner?.subcategories.find((sub) => sub.id === id)
    return owner && found ? [{ id: found.id, title: found.title, categoryId: owner.id }] : []
  })

  const similarUsers = users
    .filter(
      (user) =>
        user.id !== authorRecord.id &&
        skills.find((item) => item.id === user.teachSkillId)?.subcategoryId === skill.subcategoryId,
    )
    .map(toPublicUser)

  return {
    skill,
    author: toPublicUser(authorRecord),
    cityName: cities.find((city) => city.id === authorRecord.cityId)?.name ?? UNKNOWN_CITY,
    categoryTitle: category?.title ?? '',
    subcategoryTitle: subcategory?.title ?? '',
    learnSubcategories,
    similarUsers,
  }
}
