import type { City } from './types'
import { selectCities, selectCitiesStatus, selectCityById, getCityName } from './selectors'

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

describe('единое имя города', () => {
  it('согласует имя для карточки и страницы, включая отсутствующий город', () => {
    const cities = Object.freeze([
      { id: 'z', name: 'Зеленоград' },
      { id: 'a', name: 'Анапа' },
    ])
    const state = makeState({ items: [...cities] })
    expect(getCityName(cities, 'a')).toBe(selectCityById(state, 'a')?.name)
    expect(getCityName(cities, 'unknown')).toBe('Город не указан')
    expect(getCityName([], 'a')).toBe('Город не указан')
    expect(cities.map((city) => city.id)).toEqual(['z', 'a'])
  })

  it('переиспользует индекс и обновляет подпись после изменения справочника', () => {
    const key = vi.fn(() => 'a')
    const cities = [
      {
        get id() {
          return key()
        },
        name: 'Анапа',
      },
    ]
    expect(getCityName(cities, 'a')).toBe('Анапа')
    key.mockClear()
    expect(selectCityById(makeState({ items: cities }), 'a')?.name).toBe('Анапа')
    expect(getCityName(cities, 'unknown')).toBe('Город не указан')
    expect(key).not.toHaveBeenCalled()
    expect(getCityName([{ id: 'a', name: 'Новое имя' }], 'a')).toBe('Новое имя')
  })
})
