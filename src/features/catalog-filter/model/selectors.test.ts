import { createTestStore } from '@/app/test/createTestStore'
import { createUser } from '@/entities/user/testing'
import { createSkill } from '@/entities/skill/testing'
import {
  applyFilters,
  resetFilters,
  selectActiveFiltersCount,
  selectCatalogFilter,
  setGender,
  setMode,
  setSort,
  toggleCity,
  toggleSubcategory,
} from '../index'

const selectedFilters = {
  mode: 'teach' as const,
  subcategoryIds: ['music', 'photo'],
  gender: 'female' as const,
  cityIds: ['spb', 'kzn'],
  sort: 'oldest' as const,
}

describe('catalog-filter selectors', () => {
  it('возвращает ту же ссылку на состояние фильтров', () => {
    const store = createTestStore({ catalogFilter: selectedFilters })
    expect(selectCatalogFilter(store.getState())).toBe(store.getState().catalogFilter)
  })

  it('считает режим, подкатегории, пол и города активными фильтрами', () => {
    const store = createTestStore({ catalogFilter: selectedFilters })
    expect(selectActiveFiltersCount(store.getState())).toBe(6)
  })

  it('не считает режим «Всё», сортировку и пустые группы', () => {
    const store = createTestStore()
    store.dispatch(setSort('oldest'))
    expect(selectActiveFiltersCount(store.getState())).toBe(0)
  })

  it('действия из публичного API меняют выборку и счётчик в store', () => {
    const users = [createUser({ id: 'u1', teachSkillId: 's1', cityId: 'spb', gender: 'female' })]
    const skills = [
      createSkill({ id: 's1', authorId: 'u1', subcategoryId: 'music', title: 'Гитара' }),
    ]
    const store = createTestStore({ search: { query: 'гитара' } })
    store.dispatch(setMode('teach'))
    store.dispatch(toggleSubcategory('music'))
    store.dispatch(setGender('female'))
    store.dispatch(toggleCity('spb'))
    const state = store.getState()
    expect(applyFilters(users, skills, selectCatalogFilter(state), state.search.query)).toEqual(
      users,
    )
    expect(selectActiveFiltersCount(state)).toBe(4)
    store.dispatch(toggleCity('spb'))
    store.dispatch(toggleCity('kzn'))
    expect(applyFilters(users, skills, selectCatalogFilter(store.getState()), 'гитара')).toEqual([])
    store.dispatch(resetFilters())
    expect(selectActiveFiltersCount(store.getState())).toBe(0)
    expect(store.getState().search.query).toBe('гитара')
  })
})
