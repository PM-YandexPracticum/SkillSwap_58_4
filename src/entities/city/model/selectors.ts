import type { City } from './types'
import type { ID } from '@/shared/types'

/** Все города */
export const selectCities = (state: RootState) => state.cities.items

/** Статус загрузки справочника */
export const selectCitiesStatus = (state: RootState) => state.cities.status

/** Город по id (или undefined): из него карточка пользователя берёт `name` */
export const selectCityById = (state: RootState, cityId: ID) =>
  state.cities.items.find((city) => city.id === cityId)

/** Общее отображаемое имя города для карточек и страниц. */
export function getCityName(cities: readonly City[], cityId: ID): string {
  return cities.find((city) => city.id === cityId)?.name ?? 'Город не указан'
}
