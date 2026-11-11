import { MultiSelect } from '@/shared/ui/MultiSelect'
import { Select } from '@/shared/ui/Select'

import { getAvailableSubcategories, syncCategorySelection } from '../lib/linkCategories'
import type { Category } from '../model/types'

export interface CategorySubcategorySelectProps {
  /**
   * `multiple` — шаг 2 регистрации, списки с чекбоксами; `single` — форма навыка.
   */
  mode: 'single' | 'multiple'
  categories: readonly Category[]
  value: { categoryIds: readonly string[]; subcategoryIds: readonly string[] }
  onChange: (value: { categoryIds: string[]; subcategoryIds: string[] }) => void
  categoryLabel: string
  subcategoryLabel: string
  error?: string
}

/**
 * Пара списков категорий и подкатегорий, связанных правилом: подкатегории зависят
 * от выбранных категорий (`getAvailableSubcategories`), а выбор подкатегории и
 * снятие категории согласуются через `syncCategorySelection`.
 * Данные и выбранные значения получает пропсами, Redux не подключает.
 *
 * @see Figma: «Регистрация 2 шаг» (1:1673, 1:1717) — режим `multiple`;
 */
export function CategorySubcategorySelect(props: CategorySubcategorySelectProps) {
  const categoryOptions = props.categories.map((category) => ({
    value: category.id,
    label: category.title,
  }))

  // P6-03: подкатегории фильтруются по выбранным категориям
  const subcategoryOptions = getAvailableSubcategories(
    props.categories,
    props.value.categoryIds,
  ).map((subcategory) => ({ value: subcategory.id, label: subcategory.title }))

  // P6-03: согласование пары "категория — подкатегория" перед передачей наверх
  const emitSelection = (next: { categoryIds: string[]; subcategoryIds: string[] }) => {
    props.onChange(syncCategorySelection(props.categories, next, props.value))
  }

  if (props.mode === 'single') {
    return (
      <>
        <Select
          label={props.categoryLabel}
          placeholder="Выберите категорию"
          options={categoryOptions}
          value={props.value.categoryIds[0] ?? null}
          // P6-03: снятие категории убирает и её подкатегории
          onChange={(categoryId) =>
            emitSelection({
              categoryIds: categoryId ? [categoryId] : [],
              subcategoryIds: [...props.value.subcategoryIds],
            })
          }
          error={props.error}
        />
        <Select
          label={props.subcategoryLabel}
          placeholder="Выберите подкатегорию"
          options={subcategoryOptions}
          value={props.value.subcategoryIds[0] ?? null}
          // P6-03: выбор подкатегории отмечает её категорию; на шаге 3 массив из одного id
          onChange={(subcategoryId) =>
            emitSelection({
              categoryIds: [...props.value.categoryIds],
              subcategoryIds: subcategoryId ? [subcategoryId] : [],
            })
          }
          error={props.error}
        />
      </>
    )
  }

  return (
    <>
      <MultiSelect
        label={props.categoryLabel}
        placeholder="Выберите категорию"
        options={categoryOptions}
        value={props.value.categoryIds}
        // P6-03: снятие категории убирает её подкатегории, выбор — не трогает остальное
        onChange={(categoryIds) =>
          emitSelection({
            categoryIds,
            subcategoryIds: [...props.value.subcategoryIds],
          })
        }
        error={props.error}
      />

      <MultiSelect
        label={props.subcategoryLabel}
        placeholder="Выберите подкатегорию"
        options={subcategoryOptions}
        value={props.value.subcategoryIds}
        // P6-03: новая подкатегория вне выбранных категорий подтягивает родителя
        onChange={(subcategoryIds) =>
          emitSelection({
            categoryIds: [...props.value.categoryIds],
            subcategoryIds,
          })
        }
        error={props.error}
      />
    </>
  )
}
