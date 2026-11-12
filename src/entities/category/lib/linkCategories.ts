import type { Category, Subcategory } from '../model/types'
import { findSubcategories } from './findSubcategories'

/**
 * Подкатегории, доступные для выбора: если категории не выбраны — все,
 * иначе — только подкатегории выбранных категорий.
 * @param categories справочник категорий с подкатегориями
 * @param selectedCategoryIds выбранные категории; нет известных id — все подкатегории
 * @returns плоский массив подкатегорий, новый на каждый вызов
 */
export function getAvailableSubcategories(
  categories: readonly Category[],
  selectedCategoryIds: readonly string[],
): Subcategory[] {
  const selectedCategories = categories.filter((category) =>
    selectedCategoryIds.includes(category.id),
  )
  return (selectedCategories.length > 0 ? selectedCategories : categories).flatMap(
    (category) => category.subcategories,
  )
}

/**
 * Приводит выбор категорий и подкатегорий к согласованному виду:
 * - выбранная подкатегория автоматически отмечает свою категорию;
 * - снятая категория убирает и свои подкатегории;
 * - отсутствующие в загруженном справочнике id и повторы удаляются.
 * Пустой справочник может ещё загружаться: до его получения выбор сохраняется.
 * Функция вызывается при действии пользователя, а не для сброса управляемых props.
 *
 * @param categories справочник категорий с подкатегориями
 * @param selection текущий (новый) выбор пользователя
 * @param previous прежний выбор — нужен, чтобы отличить снятие категории
 *   от выбора подкатегории без категории: в обоих случаях новое значение
 *   выглядит одинаково
 * @returns новые массивы `categoryIds` и `subcategoryIds`; вход не изменяется
 */
export function syncCategorySelection(
  categories: readonly Category[],
  selection: { categoryIds: readonly string[]; subcategoryIds: readonly string[] },
  previous: { categoryIds: readonly string[]; subcategoryIds: readonly string[] },
): { categoryIds: string[]; subcategoryIds: string[] } {
  if (categories.length === 0) {
    return {
      categoryIds: [...selection.categoryIds],
      subcategoryIds: [...selection.subcategoryIds],
    }
  }

  const knownCategoryIds = new Set(categories.map((category) => category.id))
  const categoryIds = new Set(selection.categoryIds.filter((id) => knownCategoryIds.has(id)))
  const removedCategoryIds = new Set(previous.categoryIds.filter((id) => !categoryIds.has(id)))
  const subcategories = findSubcategories(categories, selection.subcategoryIds).filter(
    (subcategory) =>
      knownCategoryIds.has(subcategory.categoryId) &&
      !removedCategoryIds.has(subcategory.categoryId),
  )

  for (const subcategory of subcategories) {
    categoryIds.add(subcategory.categoryId)
  }

  return {
    categoryIds: [...categoryIds],
    subcategoryIds: [...new Set(subcategories.map((subcategory) => subcategory.id))],
  }
}
