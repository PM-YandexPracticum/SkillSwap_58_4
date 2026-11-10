import { useAppSelector } from '@/shared/lib/store'
import { MultiSelect } from '@/shared/ui/MultiSelect'

import { selectCategories } from '../model/selectors'

export interface CategorySubcategorySelectProps {
  /**
   * `single` — шаг 3 и форма навыка: одна категория и одна подкатегория (Select);
   * `multiple` — шаг 2 «Хочу научиться»: списки с чекбоксами (MultiSelect), можно выбрать несколько.
   */
  mode: 'single' | 'multiple'
  value: { categoryIds: readonly string[]; subcategoryIds: readonly string[] }
  onChange: (value: { categoryIds: string[]; subcategoryIds: string[] }) => void
  categoryLabel: string
  subcategoryLabel: string
  error?: string
}

/**
 * Два связанных списка «Категория» и «Подкатегория» — правило наставника,
 * логика в `lib/linkCategories.ts`:
 * - выбраны категории → в подкатегориях только их подкатегории; ничего не выбрано → все;
 * - выбрана подкатегория → её категория отмечается сама; несогласованных пар не бывает.
 *
 * @see Figma: «Регистрация 2 шаг» (1:1673, 1:1717) — режим `multiple`;
 * «Регистрация 3 шаг» (1:1761) — режим `single`.
 */
export function CategorySubcategorySelect(props: CategorySubcategorySelectProps) {
  const categories = useAppSelector(selectCategories)

  const categoryOptions = categories.map((category) => ({
    value: category.id,
    label: category.title,
  }))

  const subcategoryOptions = categories.flatMap((category) =>
    category.subcategories.map((subcategory) => ({
      value: subcategory.id,
      label: subcategory.title,
    })),
  )

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
