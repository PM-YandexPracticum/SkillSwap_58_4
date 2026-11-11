import { configureStore } from '@reduxjs/toolkit'

import citiesFromDb from '../../../../public/db/cities.json'

import { citiesReducer, fetchCities, type CitiesState } from './citiesSlice'

const initial: CitiesState = { items: [], status: 'idle' }

describe('citiesSlice', () => {
  it('pending — статус loading', () => {
    expect(citiesReducer(initial, fetchCities.pending('req')).status).toBe('loading')
  })

  it('fulfilled — города в store и статус succeeded', () => {
    const cities = [{ id: 'spb', name: 'Санкт-Петербург' }]

    expect(citiesReducer(initial, fetchCities.fulfilled(cities, 'req'))).toEqual({
      items: cities,
      status: 'succeeded',
    })
  })

  // Ошибку проверяем через редьюсер: файл «базы» после первой загрузки берётся из памяти, подмена fetch его не затронет
  it('rejected — статус failed', () => {
    const state = citiesReducer(
      { items: [], status: 'loading' },
      fetchCities.rejected(new Error('Не удалось загрузить данные'), 'req'),
    )

    expect(state.status).toBe('failed')
  })

  it('fetchCities загружает все города из «базы»', async () => {
    const store = configureStore({ reducer: { cities: citiesReducer } })

    await store.dispatch(fetchCities())

    expect(store.getState().cities.status).toBe('succeeded')
    expect(store.getState().cities.items).toEqual(citiesFromDb)
  })
})

describe('fetchCities — параллельный запрос', () => {
  it('не запускает второй запрос, пока первый не завершился', async () => {
    const store = configureStore({ reducer: { cities: citiesReducer } })
    store.dispatch(fetchCities.pending('first'))
    const second = await store.dispatch(fetchCities())
    expect(second.meta).toMatchObject({ condition: true })
    expect(store.getState().cities.status).toBe('loading')
  })
})
