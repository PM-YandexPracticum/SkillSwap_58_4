export type { City } from './model/types'
export { citiesReducer, type CitiesState } from './model/citiesSlice'
export { selectCities } from './model/selectors'
export { getCities } from './api/cityApi'
