import type { Category } from '@/entities/category'
import type { SkillFormValues, SkillPreviewData } from '@/features/skill-create'

/**
 * Собирает данные превью «Ваше предложение» из значений формы и справочника категорий.
 * Ничего не загружает и не знает о компонентах; неизвестные категория и подкатегория дают пустые названия.
 */
export function buildSkillPreview(
  values: SkillFormValues,
  categories: readonly Category[],
): SkillPreviewData {
  const category = categories.find((item) => item.id === values.categoryId)
  const subcategory = category?.subcategories.find((item) => item.id === values.subcategoryId)

  return {
    title: values.title.trim(),
    description: values.description.trim(),
    categoryTitle: category?.title ?? '',
    subcategoryTitle: subcategory?.title ?? '',
  }
}
