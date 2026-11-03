import { createMockCollection, loadSeed } from '@/shared/api'
import type { Category } from '../model/types'

/**
 * Хранилище категорий и подкатегорий.
 * Единственное место, которое знает, откуда берутся данные. Переход на настоящую БД — меняется только этот файл.
 */
const categories = createMockCollection<Category>('categories', loadSeed<Category>('categories'))

/** Справочник категорий с вложенными подкатегориями */
export function getCategories(): Promise<Category[]> {
  return categories.getAll()
}
