import { createSelector } from '@reduxjs/toolkit'
import { createLookup } from '@/shared/lib/createLookup'
import type { City } from './types'
import type { ID } from '@/shared/types'

/** Все города */
export const selectCities = (state: RootState) => state.cities.items

/** Статус загрузки справочника */
export const selectCitiesStatus = (state: RootState) => state.cities.status

/** Один индекс на версию массива; используется и селектором, и сборщиками страницы/карточки. */
const getCityLookup = createSelector([(cities: readonly City[]) => cities], (cities) =>
  createLookup(cities, (city) => city.id),
)

/** Город по id (или undefined): из него карточка пользователя берёт `name` */
export const selectCityById = (state: RootState, cityId: ID) =>
  getCityLookup(selectCities(state))(cityId)

/** Единая подпись города для карточек и страниц; поиск по кешируемому индексу массива. */
export function getCityName(cities: readonly City[], cityId: ID): string {
  return getCityLookup(cities)(cityId)?.name ?? 'Город не указан'
}
