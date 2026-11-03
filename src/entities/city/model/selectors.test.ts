import type { City } from './types'
import { selectCities, selectCitiesStatus, selectCityById } from './selectors'

const CITIES: City[] = [
  { id: 'msk', name: 'Москва' },
  { id: 'spb', name: 'Санкт-Петербург' },
]

const makeState = (overrides: Partial<RootState['cities']> = {}): RootState =>
  ({
    cities: { items: CITIES, status: 'succeeded', ...overrides },
  }) as RootState

describe('city selectors', () => {
  it('selectCities возвращает все города', () => {
    expect(selectCities(makeState())).toBe(CITIES)
  })

  it('selectCitiesStatus возвращает статус', () => {
    expect(selectCitiesStatus(makeState({ status: 'loading' }))).toBe('loading')
  })

  describe('selectCityById', () => {
    it('находит город по id', () => {
      expect(selectCityById(makeState(), 'spb')).toEqual({
        id: 'spb',
        name: 'Санкт-Петербург',
      })
    })

    it('возвращает undefined для неизвестного id', () => {
      expect(selectCityById(makeState(), 'нет такого')).toBeUndefined()
    })

    it('работает на пустом справочнике', () => {
      expect(selectCityById(makeState({ items: [] }), 'msk')).toBeUndefined()
    })
  })
})
