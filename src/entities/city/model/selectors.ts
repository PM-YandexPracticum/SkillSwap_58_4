import type { ID } from '@/shared/types'

/** Все города */
export const selectCities = (state: RootState) => state.cities.items

/** Статус загрузки справочника */
export const selectCitiesStatus = (state: RootState) => state.cities.status

/** Город по id (или undefined): из него карточка пользователя берёт `name` */
export const selectCityById = (state: RootState, cityId: ID) =>
  state.cities.items.find((city) => city.id === cityId)
