import { createMockCollection, loadSeed } from '@/shared/api'
import type { City } from '../model/types'

/**
 * Хранилище городов.
 * Единственное место, которое знает, откуда берутся данные. Переход на настоящую БД — меняется только этот файл.
 */
const cities = createMockCollection<City>('cities', loadSeed<City>('cities'))

/** Справочник городов */
export function getCities(): Promise<City[]> {
  return cities.getAll()
}
