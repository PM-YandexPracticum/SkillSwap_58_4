import type { Category } from '@/entities/category'
import type { City } from '@/entities/city'
import type { ActiveFilterTag, CatalogFilterState } from '@/features/catalog-filter'

/* Собирает выбранные фильтры в ActiveFilterTag для передачи значения items в <ActiveTags /> */
export function buildActiveFilters(
  filters: CatalogFilterState,
  categories: ReadonlyArray<Category>,
  cities: ReadonlyArray<City>,
): ActiveFilterTag[] {
  const tags: ActiveFilterTag[] = []

  if (filters.mode === 'learn') tags.push({ id: 'mode', label: 'Хочу научиться' })
  if (filters.mode === 'teach') tags.push({ id: 'mode', label: 'Могу научить' })

  if (filters.subcategoryIds.length > 0) {
    const subcategories = categories.flatMap((category) => category.subcategories)
    for (const id of filters.subcategoryIds) {
      const sub = subcategories.find((item) => item.id === id)
      if (sub) tags.push({ id: `skill:${id}`, label: sub.title })
    }
  }

  if (filters.gender === 'male') tags.push({ id: 'gender', label: 'Мужской' })
  if (filters.gender === 'female') tags.push({ id: 'gender', label: 'Женский' })

  for (const id of filters.cityIds) {
    const city = cities.find((item) => item.id === id)
    if (city) tags.push({ id: `city:${id}`, label: city.name })
  }

  return tags
}
