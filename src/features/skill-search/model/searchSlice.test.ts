import {
  queryApplied,
  queryCleared,
  searchReducer,
  selectIsSearchActive,
  selectSearchQuery,
  type SearchState
} from './searchSlice'

const makeState = (query = ''): { search: SearchState } => ({ search: { query } })

describe('searchSlice', () => {
  it('по умолчанию хранит пустую строку', () => {
    expect(searchReducer(undefined, { type: '@@INIT' })).toEqual({ query: '' })
  })

  it('queryApplied сохраняет запрос, обрезая пробелы по краям', () => {
    const state = searchReducer({ query: '' }, queryApplied('  Гитара  '))
    expect(state.query).toBe('Гитара')
  })

  it('queryApplied сохраняет запрос с пробелами внутри названия', () => {
    const state = searchReducer({ query: '' }, queryApplied('Игра на барабанах'))
    expect(state.query).toBe('Игра на барабанах')
  })

  it('queryApplied с пустой строкой сбрасывает поиск', () => {
    const state = searchReducer({ query: 'Йога' }, queryApplied('   '))
    expect(state.query).toBe('')
  })

  it('queryCleared сбрасывает запрос', () => {
    const state = searchReducer({ query: 'Йога' }, queryCleared())
    expect(state.query).toBe('')
  })

  it('queryCleared идемпотентен на пустом состоянии', () => {
    const state = searchReducer({ query: '' }, queryCleared())
    expect(state.query).toBe('')
  })

  it('selectSearchQuery возвращает текущий запрос', () => {
    expect(selectSearchQuery(makeState('Гитара'))).toBe('Гитара')
    expect(selectSearchQuery(makeState())).toBe('')
  })

  it('selectIsSearchActive: true только при непустом запросе', () => {
    expect(selectIsSearchActive(makeState('Гитара'))).toBe(true)
    expect(selectIsSearchActive(makeState())).toBe(false)
  })
})
