import { useId, useState } from 'react'
import type { Category } from '@/entities/category'
import { CATALOG } from '@/shared/config'
import ChevronDownIcon from '@/shared/assets/icons/chevron-down.svg?react'
import ChevronUpIcon from '@/shared/assets/icons/chevron-up.svg?react'
import {
  toggleCategory,
  toggleSubcategory,
} from '../model/catalogFilterSlice'
import styles from './FilterGroup.module.css'
import { SkillsCategory } from './SkillsCategory'
import { useAppDispatch, useAppSelector } from '@/shared/lib/store'
import { selectCatalogFilter } from '../model/selectors'

export interface SkillsFilterProps {
  /** Дополнительный CSS-класс */
  className?: string
  /** Справочник из selectCategories; загрузку выполняет страница */
  categories: readonly Category[]
}

/**
 * Дерево навыков с раскрытием категорий и частичным выбором.
 * Локальный reducer переиспользует готовые правила P5-01, но не меняет Redux store.
 * Подключение выбора к каталогу — P5-02.
 * @see Figma: «Каталог — фильтры применены» (1:2860)
 */
export function SkillsFilter({ className, categories }: SkillsFilterProps) {
  const dispatch = useAppDispatch()

  const [expandedIds, setExpandedIds] = useState<string[]>([])
  const [showAll, setShowAll] = useState(false)
  const subcategoryIds = useAppSelector(selectCatalogFilter).subcategoryIds
  const id = useId()
  const visibleCategories = showAll ? categories : categories.slice(0, CATALOG.CATEGORIES_VISIBLE)
  const Icon = showAll ? ChevronUpIcon : ChevronDownIcon

  return (
    <fieldset className={[styles.group, className].filter(Boolean).join(' ')}>
      <legend className={styles.title}>Навыки</legend>
      <div id={id} className={styles.list}>
        {visibleCategories.map((category) => (
          <SkillsCategory
            key={category.id}
            category={category}
            selectedIds={subcategoryIds}
            expanded={expandedIds.includes(category.id)}
            onToggleExpand={() =>
              setExpandedIds((current) =>
                current.includes(category.id)
                  ? current.filter((item) => item !== category.id)
                  : [...current, category.id],
              )
            }
            onToggleCategory={(ids) => dispatch(toggleCategory(ids))}
            onToggleSubcategory={(subId) => dispatch(toggleSubcategory(subId))}
          />
        ))}
      </div>
      {categories.length > CATALOG.CATEGORIES_VISIBLE && (
        <button
          type="button"
          className={[styles.toggleButton, styles.action].join(' ')}
          onClick={() => setShowAll((current) => !current)}
          aria-expanded={showAll}
          aria-controls={id}
          aria-label={showAll ? 'Свернуть категории' : 'Все категории'}
        >
          {showAll ? 'Свернуть' : 'Все категории'} <Icon aria-hidden="true" />
        </button>
      )}
    </fieldset>
  )
}
