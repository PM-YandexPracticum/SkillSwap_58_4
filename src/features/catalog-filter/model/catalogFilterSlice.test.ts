import { catalogFilterReducer, catalogFilterSlice } from './catalogFilterSlice'
import type { CatalogFilterState } from './types'

const selectedFilters: CatalogFilterState = {
  mode: 'teach',
  subcategoryIds: ['music', 'photo'],
  gender: 'female',
  cityIds: ['kzn', 'spb'],
  sort: 'oldest',
}

describe('catalogFilterSlice', () => {
  it('меняет режим каталога', () => {
    const state = catalogFilterReducer(undefined, catalogFilterSlice.actions.setMode('teach'))

    expect(state.mode).toBe('teach')
  })

  it('добавляет и снимает подкатегорию', () => {
    const initial = {
      mode: 'all' as const,
      subcategoryIds: ['photo'],
      gender: null,
      cityIds: [],
      sort: 'newest' as const,
    }
    const add = catalogFilterReducer(initial, catalogFilterSlice.actions.toggleSubcategory('music'))
    const remove = catalogFilterReducer(add, catalogFilterSlice.actions.toggleSubcategory('music'))

    expect(add.subcategoryIds).toEqual(['photo', 'music'])
    expect(remove.subcategoryIds).toEqual(['photo'])
  })

  it('выбирает все подкатегории категории и снимает их одним действием', () => {
    const selected = catalogFilterReducer(
      undefined,
      catalogFilterSlice.actions.toggleCategory(['music', 'photo']),
    )
    const cleared = catalogFilterReducer(
      selected,
      catalogFilterSlice.actions.toggleCategory(['music', 'photo']),
    )

    expect(selected.subcategoryIds).toEqual(['music', 'photo'])
    expect(cleared.subcategoryIds).toEqual([])
  })

  it('не дублирует подкатегории при повторном выборе категории', () => {
    const selected = catalogFilterReducer(
      { mode: 'all', subcategoryIds: ['music'], gender: null, cityIds: [], sort: 'newest' },
      catalogFilterSlice.actions.toggleCategory(['music', 'photo', 'photo']),
    )

    expect(selected.subcategoryIds).toEqual(['music', 'photo'])
  })

  it.each([
    [null, 'male'],
    ['male', 'female'],
    ['female', null],
  ] as const)('меняет пол с %s на %s, сохраняя остальные фильтры', (previous, gender) => {
    const state = { ...selectedFilters, gender: previous }

    const result = catalogFilterReducer(state, catalogFilterSlice.actions.setGender(gender))

    expect(result).toEqual({ ...state, gender })
  })

  it.each([
    ['newest', 'oldest'],
    ['oldest', 'newest'],
  ] as const)('меняет сортировку с %s на %s, сохраняя остальные фильтры', (previous, sort) => {
    const state = { ...selectedFilters, sort: previous }

    const result = catalogFilterReducer(state, catalogFilterSlice.actions.setSort(sort))

    expect(result).toEqual({ ...state, sort })
  })

  it('сбрасывает все фильтры к исходному состоянию', () => {
    const state = catalogFilterReducer(
      {
        mode: 'teach',
        subcategoryIds: ['music'],
        gender: 'female',
        cityIds: ['kzn'],
        sort: 'oldest',
      },
      catalogFilterSlice.actions.resetFilters(),
    )

    expect(state).toEqual({
      mode: 'all',
      subcategoryIds: [],
      gender: null,
      cityIds: [],
      sort: 'newest',
    })
  })
  it('пустая категория не меняет выбор', () => {
    const state = catalogFilterReducer(undefined, { type: 'init' })
    expect(catalogFilterReducer(state, catalogFilterSlice.actions.toggleCategory([]))).toBe(state)
  })

  it('снятие категории сохраняет выбор из других категорий', () => {
    const state = {
      mode: 'all' as const,
      subcategoryIds: ['music', 'photo', 'english'],
      gender: null,
      cityIds: [],
      sort: 'newest' as const,
    }
    expect(
      catalogFilterReducer(state, catalogFilterSlice.actions.toggleCategory(['music', 'photo']))
        .subcategoryIds,
    ).toEqual(['english'])
    expect(state.subcategoryIds).toEqual(['music', 'photo', 'english'])
  })

  it('добавляет город, сохраняя предыдущий выбор', () => {
    const result = catalogFilterReducer(
      selectedFilters,
      catalogFilterSlice.actions.toggleCity('msk'),
    )

    expect(result).toEqual({ ...selectedFilters, cityIds: ['kzn', 'spb', 'msk'] })
  })

  it('повторный выбор города снимает только его', () => {
    const result = catalogFilterReducer(
      selectedFilters,
      catalogFilterSlice.actions.toggleCity('kzn'),
    )

    expect(result).toEqual({ ...selectedFilters, cityIds: ['spb'] })
  })

  it.each([
    [{ type: 'mode' }, { mode: 'all' }],
    [{ type: 'gender' }, { gender: null }],
    [{ type: 'subcategory', id: 'music' }, { subcategoryIds: ['photo'] }],
    [{ type: 'subcategory', id: 'unknown' }, { subcategoryIds: ['music', 'photo'] }],
    [{ type: 'city', id: 'kzn' }, { cityIds: ['spb'] }],
    [{ type: 'city', id: 'unknown' }, { cityIds: ['kzn', 'spb'] }],
  ] as const)('удаляет отдельный фильтр %j', (removal, expected) => {
    const result = catalogFilterReducer(
      selectedFilters,
      catalogFilterSlice.actions.removeFilter(removal),
    )

    expect(result).toEqual({
      ...selectedFilters,
      ...expected,
    })
  })

  it('сброс не изменяет предыдущее состояние', () => {
    const state = catalogFilterReducer(undefined, catalogFilterSlice.actions.setMode('learn'))
    const reset = catalogFilterReducer(state, catalogFilterSlice.actions.resetFilters())
    expect(reset.mode).toBe('all')
    expect(state.mode).toBe('learn')
  })
})

it('переключает несортированную категорию с дублями, сохраняя порядок остальных фильтров', () => {
  const state = { ...selectedFilters, subcategoryIds: ['z', 'music', 'a'] }
  const selected = catalogFilterReducer(
    state,
    catalogFilterSlice.actions.toggleCategory(['photo', 'music', 'photo']),
  )
  expect(selected.subcategoryIds).toEqual(['z', 'music', 'a', 'photo'])
  const cleared = catalogFilterReducer(
    selected,
    catalogFilterSlice.actions.toggleCategory(['music', 'photo']),
  )
  expect(cleared.subcategoryIds).toEqual(['z', 'a'])
  expect(cleared.sort).toBe('oldest')
  expect(state.subcategoryIds).toEqual(['z', 'music', 'a'])
})

it.each(['subcategory', 'city'] as const)('снятие %s сохраняет выбранную сортировку', (type) => {
  expect(
    catalogFilterReducer(
      selectedFilters,
      catalogFilterSlice.actions.removeFilter({ type, id: 'music' }),
    ).sort,
  ).toBe('oldest')
})
