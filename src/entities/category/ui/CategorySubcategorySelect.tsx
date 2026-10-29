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
 * Два связанных списка «Категория» и «Подкатегория» — правило наставника, логика в `lib/linkCategories.ts`:
 * - выбраны категории → в подкатегориях только их подкатегории; ничего не выбрано → все;
 * - выбрана подкатегория → её категория отмечается сама; несогласованных пар не бывает.
 * @see Figma: «Регистрация 2 шаг» (1:1673, 1:1717) — режим `multiple`; «Регистрация 3 шаг» (1:1761) — режим `single`
 */
export function CategorySubcategorySelect(_props: CategorySubcategorySelectProps) {
  // TODO: Select или MultiSelect из shared/ui + getAvailableSubcategories / syncCategorySelection
  return null
}
