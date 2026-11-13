import type { Gender } from '@/entities/user'

/** Режим автора карточки: learn — хочет учиться, teach — может научить, all — оба набора. */
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

/** Фильтр для снятия отдельной плашки; сортировка меняется только через setSort. */
export type FilterRemoval =
  | { type: 'mode' }
  | { type: 'subcategory'; id: string }
  | { type: 'gender' }
  | { type: 'city'; id: string }
