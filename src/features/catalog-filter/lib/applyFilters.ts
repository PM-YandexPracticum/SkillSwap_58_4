import type { Skill } from '@/entities/skill'
import type { User } from '@/entities/user'
import type { CatalogFilterState } from '../model/types'

/**
 * Чистая функция фильтрации каталога. Не мутирует входной массив.
 * Правило из ТЗ: все фильтры и поиск комбинируются логикой AND; внутри одного блока несколько отмеченных значений — «любой из» (иначе два города дают пустой результат).
 * Учитывает режим («Хочу научиться» — по `learnSubcategoryIds`, «Могу научить» — по подкатегории навыка),
 * подкатегории, пол, города, строку поиска (по названию навыка и подкатегориям) и сортировку по `createdAt`.
 * Обязательно покрыть unit-тестами — это ядро бизнес-логики каталога.
 */
export function applyFilters(
  _users: readonly User[],
  _skills: readonly Skill[],
  _filter: CatalogFilterState,
  _query: string,
): User[] {
  // TODO: реализовать
  throw new Error('Not implemented: applyFilters')
}
