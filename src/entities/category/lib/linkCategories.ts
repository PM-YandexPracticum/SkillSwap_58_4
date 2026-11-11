import type { Category, Subcategory } from '../model/types'

/**
 * Подкатегории, доступные для выбора: если категории не выбраны — все,
 * иначе — только подкатегории выбранных категорий.
 * @param categories справочник категорий с подкатегориями
 * @param selectedCategoryIds выбранные категории; пусто — все подкатегории
 * @returns плоский массив подкатегорий, новый на каждый вызов
 */
export function getAvailableSubcategories(
  categories: readonly Category[],
  selectedCategoryIds: readonly string[],
): Subcategory[] {
  if (selectedCategoryIds.length === 0) {
    return categories.flatMap((category) => category.subcategories)
  }

  return categories
    .filter((category) => selectedCategoryIds.includes(category.id))
    .flatMap((category) => category.subcategories)
}

/**
 * Приводит выбор категорий и подкатегорий к согласованному виду:
 * - выбранная подкатегория автоматически отмечает свою категорию;
 * - снятая категория убирает и свои подкатегории;
 * - подкатегория без известной категории остаётся как есть.
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
  // Возвращает id категории для подкатегории или undefined, если её нет в справочнике.
  function getParentCategoryId(subcategoryId: string): string | undefined {
    for (const category of categories) {
      for (const subcategory of category.subcategories) {
        if (subcategory.id === subcategoryId) {
          return subcategory.categoryId
        }
      }
    }

    return undefined
  }

  // 1. Категории, которые были выбраны и исчезли из нового выбора.
  const removedCategoryIds: string[] = []

  for (const categoryId of previous.categoryIds) {
    if (!selection.categoryIds.includes(categoryId)) {
      removedCategoryIds.push(categoryId)
    }
  }

  // 2. Подкатегории снятых категорий отбрасываем, остальные сохраняем.
  const keptSubcategoryIds: string[] = []

  for (const subcategoryId of selection.subcategoryIds) {
    const parentId = getParentCategoryId(subcategoryId)

    // Неизвестная подкатегория: не наш случай, оставляем без изменений.
    if (parentId === undefined) {
      keptSubcategoryIds.push(subcategoryId)
      continue
    }

    // Категорию сняли — подкатегория не имеет смысла.
    if (removedCategoryIds.includes(parentId)) {
      continue
    }

    keptSubcategoryIds.push(subcategoryId)
  }

  // 3. Каждая оставшаяся подкатегория подтягивает свою категорию.
  const nextCategoryIds: string[] = [...selection.categoryIds]

  for (const subcategoryId of keptSubcategoryIds) {
    const parentId = getParentCategoryId(subcategoryId)

    if (parentId === undefined) {
      continue
    }

    if (!nextCategoryIds.includes(parentId)) {
      nextCategoryIds.push(parentId)
    }
  }

  return { categoryIds: nextCategoryIds, subcategoryIds: keptSubcategoryIds }
}
