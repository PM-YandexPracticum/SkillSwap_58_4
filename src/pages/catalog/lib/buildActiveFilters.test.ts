import { describe, expect, it } from 'vitest'
import type { Category } from '@/entities/category'
import type { City } from '@/entities/city'
import type { CatalogFilterState } from '@/features/catalog-filter'
import { buildActiveFilters } from './buildActiveFilters'

const categories: Category[] = [
  {
    id: 'art',
    title: 'Творчество и искусство',
    icon: 'palette',
    color: 'art',
    subcategories: [
      { id: 'photo', categoryId: 'art', title: 'Фотография' },
      { id: 'music', categoryId: 'art', title: 'Музыка и звук' },
    ],
  },
]

const cities: City[] = [
  { id: 'msk', name: 'Москва' },
  { id: 'spb', name: 'Санкт-Петербург' },
]

const empty: CatalogFilterState = {
  mode: 'all',
  subcategoryIds: [],
  gender: null,
  cityIds: [],
  sort: 'newest',
}

describe('buildActiveFilters', () => {
  it('пустые фильтры -> []', () => {
    expect(buildActiveFilters(empty, categories, cities)).toEqual([])
  })

  it('mode learn -> «Хочу научиться»', () => {
    expect(buildActiveFilters({ ...empty, mode: 'learn' }, categories, cities)).toEqual([
      { id: 'mode', label: 'Хочу научиться' },
    ])
  })

  it('mode teach -> «Могу научить»', () => {
    expect(buildActiveFilters({ ...empty, mode: 'teach' }, categories, cities)).toEqual([
      { id: 'mode', label: 'Могу научить' },
    ])
  })

  it('подкатегория -> плашка с префиксом skill:', () => {
    expect(
      buildActiveFilters({ ...empty, subcategoryIds: ['photo'] }, categories, cities),
    ).toEqual([{ id: 'skill:photo', label: 'Фотография' }])
  })

  it('неизвестная подкатегория пропускается', () => {
    expect(
      buildActiveFilters({ ...empty, subcategoryIds: ['unknown'] }, categories, cities),
    ).toEqual([])
  })

  it('город -> плашка с префиксом city:', () => {
    expect(buildActiveFilters({ ...empty, cityIds: ['msk'] }, categories, cities)).toEqual([
      { id: 'city:msk', label: 'Москва' },
    ])
  })

  it('gender male / female', () => {
    expect(buildActiveFilters({ ...empty, gender: 'male' }, categories, cities)).toEqual([
      { id: 'gender', label: 'Мужской' },
    ])
    expect(buildActiveFilters({ ...empty, gender: 'female' }, categories, cities)).toEqual([
      { id: 'gender', label: 'Женский' },
    ])
  })

  it('сортировка НЕ создаёт плашку', () => {
    expect(buildActiveFilters({ ...empty, sort: 'oldest' }, categories, cities)).toEqual([])
  })

  it('несколько фильтров идут в порядке mode → skills → gender → cities', () => {
    const tags = buildActiveFilters(
      {
        mode: 'learn',
        subcategoryIds: ['photo', 'music'],
        gender: 'female',
        cityIds: ['msk'],
        sort: 'newest',
      },
      categories,
      cities,
    )
    expect(tags.map((tag) => tag.id)).toEqual([
      'mode',
      'skill:photo',
      'skill:music',
      'gender',
      'city:msk',
    ])
  })

  it('связка с parseFilterRemoval: id плашек разбираются обратно', () => {
    const tags = buildActiveFilters(
      { ...empty, subcategoryIds: ['photo'], cityIds: ['msk'] },
      categories,
      cities,
    )
    // проверяем только то, что id соответствуют префиксам, которые parseFilterRemoval ждёт
    expect(tags[0].id.startsWith('skill:')).toBe(true)
    expect(tags[1].id.startsWith('city:')).toBe(true)
  })
})
