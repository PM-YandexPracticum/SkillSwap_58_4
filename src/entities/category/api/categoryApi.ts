import { createMockCollection, SEED } from '@/shared/api'
import type { Category } from '../model/types'

/**
 * Хранилище категорий и подкатегорий.
 * Единственное место, которое знает, откуда берутся данные. Переход на настоящую БД — меняется только этот файл.
 */
const categories = createMockCollection<Category>(
  'categories',
  SEED.categories as readonly Category[],
)

/** Справочник категорий с вложенными подкатегориями */
export function getCategories(): Promise<Category[]> {
  return categories.getAll()
}
