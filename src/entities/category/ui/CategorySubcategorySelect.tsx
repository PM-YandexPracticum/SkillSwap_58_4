import type { Ref } from 'react'

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
  /** Ошибка поля категории; `error` сохраняет обратную совместимость. */
  categoryError?: string
  /** Ошибка поля подкатегории; `error` сохраняет обратную совместимость. */
  subcategoryError?: string
  /** Уход фокуса из поля подкатегорий, включая его раскрытый список. */
  onSubcategoryBlur?: () => void
  /** Ссылка на поле подкатегорий для фокусировки ошибки формы. */
  subcategoryRef?: Ref<HTMLButtonElement>
  error?: string
}

/**
 * Пара списков категорий и подкатегорий, связанных правилом: подкатегории зависят
 * от выбранных категорий (`getAvailableSubcategories`), а выбор подкатегории и
 * снятие категории согласуются через `syncCategorySelection`.
 * Данные и выбранные значения получает пропсами, Redux не подключает.
 *
 * @see Figma: «Регистрация 2 шаг» (1:1673, 1:1717) — `multiple`; «Регистрация 3 шаг» (1:1761) — `single`.
 */
export function CategorySubcategorySelect(props: CategorySubcategorySelectProps) {
  const categoryOptions = props.categories.map((category) => ({
    value: category.id,
    label: category.title,
  }))

  const subcategoryOptions = getAvailableSubcategories(
    props.categories,
    props.value.categoryIds,
  ).map((subcategory) => ({ value: subcategory.id, label: subcategory.title }))

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
          onChange={(categoryId) =>
            emitSelection({
              categoryIds: categoryId ? [categoryId] : [],
              subcategoryIds: [...props.value.subcategoryIds],
            })
          }
          error={props.categoryError ?? props.error}
        />
        <Select
          ref={props.subcategoryRef}
          onBlur={props.onSubcategoryBlur}
          label={props.subcategoryLabel}
          placeholder="Выберите подкатегорию"
          options={subcategoryOptions}
          value={props.value.subcategoryIds[0] ?? null}
          onChange={(subcategoryId) =>
            emitSelection({
              categoryIds: [...props.value.categoryIds],
              subcategoryIds: subcategoryId ? [subcategoryId] : [],
            })
          }
          error={props.subcategoryError ?? props.error}
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
          emitSelection({
            categoryIds,
            subcategoryIds: [...props.value.subcategoryIds],
          })
        }
        error={props.categoryError ?? props.error}
      />

      <MultiSelect
        ref={props.subcategoryRef}
        onBlur={props.onSubcategoryBlur}
        label={props.subcategoryLabel}
        placeholder="Выберите подкатегорию"
        options={subcategoryOptions}
        value={props.value.subcategoryIds}
        onChange={(subcategoryIds) =>
          emitSelection({
            categoryIds: [...props.value.categoryIds],
            subcategoryIds,
          })
        }
        error={props.subcategoryError ?? props.error}
      />
    </>
  )
}
