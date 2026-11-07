import type { Skill } from '@/entities/skill'
import type { PublicUser } from '@/entities/user'
import type { CatalogFilterState } from '../model/types'

/**
 * Чистая функция фильтрации каталога. Не мутирует входной массив.
 * Правило из ТЗ: все фильтры и поиск комбинируются логикой AND; внутри одного блока несколько отмеченных значений — «любой из» (иначе два города дают пустой результат).
 * Учитывает режим («Хочу научиться» — по `learnSubcategoryIds`, «Могу научить» — по подкатегории навыка),
 * подкатегории, пол, города, строку поиска (только по названию предлагаемого навыка) и сортировку по `createdAt`.
 * В режиме «Всё» подходят и желаемые, и предлагаемые подкатегории.
 * При равных датах сохраняется исходный порядок. Пользователи уже очищены до PublicUser вызывающим кодом.
 */
export function applyFilters(
  users: readonly PublicUser[],
  skills: readonly Skill[],
  filter: CatalogFilterState,
  query: string,
): PublicUser[] {
  const skillsById = new Map(skills.map((skill) => [skill.id, skill]))
  const normalizedQuery = query.trim().toLocaleLowerCase('ru-RU')
  const matchesSubcategory = (user: PublicUser) => {
    const teachSubcategoryId = skillsById.get(user.teachSkillId)?.subcategoryId
    const hasSelection = filter.subcategoryIds.length > 0
    const wantsToLearn = user.learnSubcategoryIds.some(
      (id) => !hasSelection || filter.subcategoryIds.includes(id),
    )
    const canTeach =
      teachSubcategoryId !== undefined &&
      (!hasSelection || filter.subcategoryIds.includes(teachSubcategoryId))
    if (filter.mode === 'learn') return wantsToLearn
    if (filter.mode === 'teach') return canTeach
    return !hasSelection || wantsToLearn || canTeach
  }

  return users
    .filter((user) => {
      const skill = skillsById.get(user.teachSkillId)
      const matchesQuery =
        normalizedQuery.length === 0 ||
        skill?.title.toLocaleLowerCase('ru-RU').includes(normalizedQuery) === true
      const matchesGender = filter.gender === null || user.gender === filter.gender
      const matchesCity = filter.cityIds.length === 0 || filter.cityIds.includes(user.cityId)
      return matchesQuery && matchesSubcategory(user) && matchesGender && matchesCity
    })
    .sort((a, b) => {
      const dateDifference = Date.parse(b.createdAt) - Date.parse(a.createdAt)
      const difference = filter.sort === 'newest' ? dateDifference : -dateDifference
      return difference
    })
}
