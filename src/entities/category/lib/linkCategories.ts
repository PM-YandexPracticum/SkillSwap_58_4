import type { Category, Subcategory } from '../model/types'

/**
 * Какие подкатегории показывать в списке «Подкатегория» — правило наставника:
 * выбраны категории → только их подкатегории; не выбрано ничего → все подкатегории.
 * @param selectedCategoryIds выбранные категории (на шаге 3 — массив из одной или пустой)
 */
export function getAvailableSubcategories(
  _categories: readonly Category[],
  _selectedCategoryIds: readonly string[],
): Subcategory[] {
  // TODO: реализовать + unit-тесты
  throw new Error('Not implemented: getAvailableSubcategories')
}

/**
 * Выбор подкатегорий «подтягивает» их категории: выбрал «Фотографию» без категории → отмечается «Творчество и искусство».
 * Снятая категория снимает и свои подкатегории. Возвращает НОВЫЕ массивы — несогласованных пар не бывает.
 */
export function syncCategorySelection(
  _categories: readonly Category[],
  _selection: { categoryIds: readonly string[]; subcategoryIds: readonly string[] },
): { categoryIds: string[]; subcategoryIds: string[] } {
  // TODO: реализовать + unit-тесты на все случаи
  throw new Error('Not implemented: syncCategorySelection')
}
