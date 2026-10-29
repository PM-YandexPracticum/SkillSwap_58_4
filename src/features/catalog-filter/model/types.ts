import type { Gender } from '@/entities/user'

/** Радио-группа «Всё / Хочу научиться / Могу научить» */
export type FilterMode = 'all' | 'learn' | 'teach'

/** Сортировка результатов: сначала новые / сначала старые (по `createdAt`) */
export type SortOrder = 'newest' | 'oldest'

/** Состояние фильтров каталога (левая панель «Фильтры» + поиск в шапке) */
export interface CatalogFilterState {
  mode: FilterMode
  /** Выбранные подкатегории в блоке «Навыки» */
  subcategoryIds: string[]
  /** «Пол автора»: null = «Не имеет значения» */
  gender: Gender | null
  /** Выбранные города (id из entities/city) */
  cityIds: string[]
  sort: SortOrder
}
