export type { City } from './model/types'
export { citiesReducer, fetchCities, type CitiesState } from './model/citiesSlice'
export { selectCities, selectCitiesStatus, selectCityById } from './model/selectors'
export { getCities } from './api/cityApi'
