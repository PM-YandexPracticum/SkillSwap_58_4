import { createLookup } from './createLookup'

describe('createLookup', () => {
  it('находит края и середину несортированного списка, не меняя порядок', () => {
    const items = Object.freeze([{ id: 'c' }, { id: 'a' }, { id: 'b' }])
    const lookup = createLookup(items, (item) => item.id)
    expect(lookup('a')).toBe(items[1])
    expect(lookup('b')).toBe(items[2])
    expect(lookup('c')).toBe(items[0])
    expect(items.map((item) => item.id)).toEqual(['c', 'a', 'b'])
  })

  it.each(['', '0', 'aa', 'z'])('не находит отсутствующий ключ %s', (key) => {
    expect(createLookup([{ id: 'a' }, { id: 'c' }], (item) => item.id)(key)).toBeUndefined()
  })

  it('поддерживает пустой список, одну запись и дубли с выбором первой', () => {
    expect(createLookup<string>([], (item) => item)('a')).toBeUndefined()
    const first = { id: 'a' }
    expect(createLookup([first], (item) => item.id)('a')).toBe(first)
    expect(createLookup([first, { id: 'a' }], (item) => item.id)('a')).toBe(first)
  })

  it('повторный поиск не перебирает исходные данные и не извлекает ключи заново', () => {
    const items = Array.from({ length: 1024 }, (_, i) => ({ id: String(i) }))
    const keyOf = vi.fn((item: { id: string }) => item.id)
    const lookup = createLookup(items, keyOf)
    expect(keyOf).toHaveBeenCalledTimes(items.length)
    keyOf.mockClear()
    for (const item of items) expect(lookup(item.id)).toBe(item)
    expect(keyOf).not.toHaveBeenCalled()
  })
})
