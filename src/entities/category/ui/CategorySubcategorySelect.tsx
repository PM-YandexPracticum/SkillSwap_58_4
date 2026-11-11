import { MultiSelect } from '@/shared/ui/MultiSelect'
import { Select } from '@/shared/ui/Select'

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
 * Вёрстка двух списков с чекбоксами. Данные и выбранные значения получает пропсами.
 * TODO(P6-03): связать списки через getAvailableSubcategories / syncCategorySelection.
 * Пока каждый список показывает все варианты и меняет только свою часть выбора.
 *
 * @see Figma: «Регистрация 2 шаг» (1:1673, 1:1717) — режим `multiple`;
 */
export function CategorySubcategorySelect(props: CategorySubcategorySelectProps) {
  const categoryOptions = props.categories.map((category) => ({
    value: category.id,
    label: category.title,
  }))

  const subcategoryOptions = props.categories.flatMap((category) =>
    category.subcategories.map((subcategory) => ({
      value: subcategory.id,
      label: subcategory.title,
    })),
  )

  if (props.mode === 'single') {
    return (
      <>
        <Select
          label={props.categoryLabel}
          placeholder="Выберите категорию"
          options={categoryOptions}
          value={props.value.categoryIds[0] ?? null}
          onChange={(categoryId) =>
            props.onChange({
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
          onChange={(subcategoryId) =>
            props.onChange({
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
        onChange={(categoryIds) =>
          props.onChange({
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
        onChange={(subcategoryIds) =>
          props.onChange({
            categoryIds: [...props.value.categoryIds],
            subcategoryIds,
          })
        }
        error={props.error}
      />
    </>
  )
}
