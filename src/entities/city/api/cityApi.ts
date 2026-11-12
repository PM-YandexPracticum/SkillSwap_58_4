import { createMockCollection, isRecord, isString, loadSeed } from '@/shared/api'
import type { City } from '../model/types'

const isCity = (value: unknown): value is City =>
  isRecord(value) && isString(value.id) && isString(value.name)

/**
 * Хранилище городов.
 * Единственное место, которое знает, откуда берутся данные. Переход на настоящую БД — меняется только этот файл.
 */
const cities = createMockCollection<City>('cities', loadSeed<City>('cities', isCity), {
  validate: isCity,
})

/** Справочник городов */
export function getCities(): Promise<City[]> {
  return cities.getAll()
}
