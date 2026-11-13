import type { FilterRemoval } from '@/features/catalog-filter'

/** Переводит поддержанный id плашки в FilterRemoval; неизвестный формат вызывает ошибку. */
export function parseFilterRemoval(id: string): FilterRemoval {
  if (id === 'mode') return { type: 'mode' }
  if (id === 'gender') return { type: 'gender' }
  if (id === 'sort') return { type: 'sort' }
  if (id.startsWith('skill:')) return { type: 'subcategory', id: id.slice(6) }
  if (id.startsWith('city:')) return { type: 'city', id: id.slice(5) }
  throw new Error(`Unknown filter tag id: ${id}`)
}
