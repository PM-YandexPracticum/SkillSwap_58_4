import { useId } from 'react'
import type { Category } from '@/entities/category'
import ChevronDownIcon from '@/shared/assets/icons/chevron-down.svg?react'
import ChevronUpIcon from '@/shared/assets/icons/chevron-up.svg?react'
import { Checkbox } from '@/shared/ui/Checkbox'
import { IconButton } from '@/shared/ui/IconButton'
import groupStyles from './FilterGroup.module.css'
import styles from './SkillsFilter.module.css'

export interface SkillsCategoryProps {
  category: Category
  selectedIds: readonly string[]
  expanded: boolean
  onToggleExpand: () => void
  onToggleCategory: (ids: readonly string[]) => void
  onToggleSubcategory: (id: string) => void
}

/**
 * Строка категории и её подкатегории; checked/indeterminate вычисляются по selectedIds.
 * Не хранит вторую копию выбранных категорий и не меняет store.
 * @see Figma: «Каталог — фильтры применены» (1:2860)
 */
export function SkillsCategory({
  category,
  selectedIds,
  expanded,
  onToggleExpand,
  onToggleCategory,
  onToggleSubcategory,
}: SkillsCategoryProps) {
  const id = useId()
  const ids = category.subcategories.map((sub) => sub.id)
  const checkedCount = ids.filter((subId) => selectedIds.includes(subId)).length
  const Icon = expanded ? ChevronUpIcon : ChevronDownIcon

  return (
    <div>
      <div className={styles.categoryHeader}>
        <Checkbox
          label={category.title}
          checked={ids.length > 0 && checkedCount === ids.length}
          disabled={ids.length === 0}
          indeterminate={checkedCount > 0 && checkedCount < ids.length}
          onChange={() => onToggleCategory(ids)}
          className={[groupStyles.item, styles.categoryCheckbox].join(' ')}
        />
        {ids.length > 0 && (
          <IconButton
            ariaLabel={`${expanded ? 'Свернуть' : 'Развернуть'} категорию «${category.title}»`}
            aria-expanded={expanded}
            aria-controls={id}
            className={styles.expandButton}
            onClick={onToggleExpand}
            icon={<Icon aria-hidden="true" />}
          />
        )}
      </div>
      <div id={id} hidden={!expanded} className={styles.subcategories}>
        {expanded &&
          category.subcategories.map((sub) => (
            <Checkbox
              key={sub.id}
              label={sub.title}
              checked={selectedIds.includes(sub.id)}
              onChange={() => onToggleSubcategory(sub.id)}
              className={groupStyles.item}
            />
          ))}
      </div>
    </div>
  )
}
