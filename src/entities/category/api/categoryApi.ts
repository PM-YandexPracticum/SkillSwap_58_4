import { createMockCollection, isRecord, isString, loadSeed } from '@/shared/api'
import type { Category } from '../model/types'

const isSubcategory = (value: unknown): boolean =>
  isRecord(value) && isString(value.id) && isString(value.categoryId) && isString(value.title)

const isCategory = (value: unknown): value is Category =>
  isRecord(value) &&
  isString(value.id) &&
  isString(value.title) &&
  isString(value.icon) &&
  isString(value.color) &&
  Array.isArray(value.subcategories) &&
  value.subcategories.every(isSubcategory)

/**
 * Хранилище категорий и подкатегорий.
 * Единственное место, которое знает, откуда берутся данные. Переход на настоящую БД — меняется только этот файл.
 */
const categories = createMockCollection<Category>(
  'categories',
  loadSeed<Category>('categories', isCategory),
  { validate: isCategory },
)

/** Справочник категорий с вложенными подкатегориями */
export function getCategories(): Promise<Category[]> {
  return categories.getAll()
}
