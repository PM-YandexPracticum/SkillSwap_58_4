import { createLookup } from '@/shared/lib/createLookup'
import type { Category } from '@/entities/category'
import type { City } from '@/entities/city'
import type { ActiveFilterTag, CatalogFilterState } from '@/features/catalog-filter'

/** Строит подписи плашек ActiveFilters; неизвестные id пропускает, поиск хранится отдельно. */
export function buildActiveFilters(
  filters: CatalogFilterState,
  categories: ReadonlyArray<Category>,
  cities: ReadonlyArray<City>,
): ActiveFilterTag[] {
  const tags: ActiveFilterTag[] = []

  if (filters.mode === 'learn') tags.push({ id: 'mode', label: 'Хочу научиться' })
  if (filters.mode === 'teach') tags.push({ id: 'mode', label: 'Могу научить' })

  if (filters.subcategoryIds.length > 0) {
    const findSubcategory = createLookup(
      categories.flatMap((category) => category.subcategories),
      (subcategory) => subcategory.id,
    )
    for (const id of filters.subcategoryIds) {
      const sub = findSubcategory(id)
      if (sub) tags.push({ id: `skill:${id}`, label: sub.title })
    }
  }

  if (filters.gender === 'male') tags.push({ id: 'gender', label: 'Мужской' })
  if (filters.gender === 'female') tags.push({ id: 'gender', label: 'Женский' })

  const findCity = createLookup(cities, (city) => city.id)
  for (const id of filters.cityIds) {
    const city = findCity(id)
    if (city) tags.push({ id: `city:${id}`, label: city.name })
  }

  return tags
}
