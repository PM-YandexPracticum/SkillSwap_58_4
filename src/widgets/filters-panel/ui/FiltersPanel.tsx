import { useId } from 'react'
import {
  ModeFilter,
  SkillsFilter,
  GenderFilter,
  CityFilter,
  ResetFiltersButton,
} from '@/features/catalog-filter'
import { selectCategories } from '@/entities/category'
import { useAppSelector } from '@/shared/lib/store'
import styles from './FiltersPanel.module.css'

export interface FiltersPanelProps {
  /** Дополнительный CSS-класс */
  className?: string
  /** Количество выбранных фильтров из общего селектора */
  filtersCount?: number
  /** Сброс фильтров, который выполняет контейнер каталога */
  onReset?: () => void
}

/**
 * Левая колонка каталога: режим, навыки, пол автора и города из готовых селекторов.
 * Загрузкой справочников управляет страница; выборы пишутся в общий store.
 * @see Figma: «Каталог — фильтры применены» (1:2860)
 */
export function FiltersPanel({ className, filtersCount = 0, onReset }: FiltersPanelProps) {
  const categories = useAppSelector(selectCategories)
  const titleId = useId()

  return (
    <aside
      aria-labelledby={titleId}
      className={[styles.panel, className].filter(Boolean).join(' ')}
    >
      <div className={styles.header}>
        <h2 className={styles.title} id={titleId}>
          {filtersCount > 0 ? `Фильтры (${filtersCount})` : 'Фильтры'}
        </h2>
        <ResetFiltersButton onClick={onReset} />
      </div>
      <div className={styles.content}>
        <ModeFilter />
        <SkillsFilter categories={categories} />
        <GenderFilter />
        <CityFilter />
      </div>
    </aside>
  )
}
