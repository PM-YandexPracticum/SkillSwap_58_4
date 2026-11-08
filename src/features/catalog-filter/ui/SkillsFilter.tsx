import type { Category } from '@/entities/category'
import ChevronDownIcon from '@/shared/assets/icons/chevron-down.svg?react'
import ChevronUpIcon from '@/shared/assets/icons/chevron-up.svg?react'
import type { ID } from '@/shared/types'
import { Checkbox } from '@/shared/ui/Checkbox'
import { useState } from 'react'
import styles from './SkillsFilter.module.css'

const CATEGORIES_VISIBLE = 6; // Локальная константа

export interface SkillsFilterProps {
  /** Дополнительный CSS-класс */
  className?: string
  /** Список категорий, который придет из API */
  categories: Category[]
}

/**
 * Фильтр «Навыки» с раскрывающимися категориями.
 */
export function SkillsFilter({ className, categories }: SkillsFilterProps) {
  // Храним ID раскрытых категорий
  const [expandedIds, setExpandedIds] = useState<ID[]>([])

  const [selectedCategories, setSelectedCategories] = useState<ID[]>([])
  const [selectedSubcategories, setSelectedSubcategories] = useState<ID[]>([])

  const toggleExpand = (id: ID) => {
    setExpandedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id],
    )
  }

  const toggleCategory = (id: ID) => {
    setSelectedCategories((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id],
    )
  }

  const toggleSubcategory = (id: ID) => {
    setSelectedSubcategories((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id],
    )
  }

  const visibleCategories = showAll ? categories : categories.slice(0, CATEGORIES_VISIBLE);
  const hasMore = categories.length > CATEGORIES_VISIBLE;

  return (
    <div className={[styles.container, className].filter(Boolean).join(' ')}>
      <h3 className={styles.title}>Навыки</h3>

      <div className={styles.list}>
        {categories.map((category) => {
          const isExpanded = expandedIds.includes(category.id)

          // Логика для "частичного выбора" (когда выбрана подкатегория, но не вся категория)
          const isCategoryChecked = selectedCategories.includes(category.id)
          const hasSelectedSub = category.subcategories.some((sub) =>
            selectedSubcategories.includes(sub.id),
          )

          return (
            <div key={category.id} className={styles.categoryGroup}>
              <div className={styles.categoryHeader}>
                <Checkbox
                  label={category.title}
                  checked={isCategoryChecked}
                  indeterminate={isIndeterminate}
                  onChange={() => toggleCategory(subcategoryIds)} // Передаем только ID подкатегорий
                  className={styles.skillItem}
                />
                <button
                  type="button"
                  className={styles.toggleButton}
                  onClick={() => toggleExpand(category.id)}
                  aria-label={isExpanded ? 'Свернуть категорию' : 'Развернуть категорию'}
                >
                  {isExpanded ? <ChevronUpIcon /> : <ChevronDownIcon />}
                </button>
              </div>

              {isExpanded && (
                <div className={styles.subcategories}>
                  {category.subcategories.map((sub) => (
                    <Checkbox
                      key={sub.id}
                      label={sub.title}
                      checked={selectedSubcategories.includes(sub.id)}
                      onChange={() => toggleSubcategory(sub.id)}
                    />
                  ))}
                </div>
              )}
            </div>
          )
        })}
      </div>

      {hasMore && (
        <button
          type="button"
          className={styles.showAllButton}
          onClick={() => setShowAll(!showAll)}
          aria-expanded={showAll}
        >
          {showAll ? 'Свернуть' : 'Все категории'} <ChevronDownIcon className={styles.smallIcon} />
        </button>
      )}
    </div>
  )
}
