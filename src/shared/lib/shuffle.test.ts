import { shuffle } from './shuffle'

describe('shuffle', () => {
  it('не мутирует исходный массив', () => {
    const original = [1, 2, 3, 4, 5]
    const copy = [...original]

    shuffle(original)

    expect(original).toEqual(copy)
  })

  it('возвращает новый массив', () => {
    const original = [1, 2, 3]

    const result = shuffle(original)

    expect(result).not.toBe(original)
  })

  it('возвращает массив той же длины', () => {
    const items = [1, 2, 3, 4, 5]

    const result = shuffle(items)

    expect(result).toHaveLength(items.length)
  })

  it('содержит те же элементы', () => {
    const items = [1, 2, 3, 4, 5]

    const result = shuffle(items)

    expect(result.sort()).toEqual(items.sort())
  })

  it('работает с пустым массивом', () => {
    const result = shuffle([])

    expect(result).toEqual([])
  })

  it('работает с массивом из одного элемента', () => {
    const result = shuffle([42])

    expect(result).toEqual([42])
  })

  it('предсказуемый результат при подмене random', () => {
    const items = [1, 2, 3, 4]

    const mockRandom = () => 0

    const result = shuffle(items, mockRandom)

    expect(result).toEqual([2, 3, 4, 1])
  })

  it('может сохранить исходный порядок — это допустимая случайная перестановка', () => {
    expect(shuffle([1, 2, 3, 4], () => 0.999)).toEqual([1, 2, 3, 4])
  })

  it('работает с readonly-массивом и сохраняет повторяющиеся элементы и ссылки на объекты', () => {
    const first = { id: 'first' }
    const second = { id: 'second' }
    const items = Object.freeze([first, first, second])

    const result = shuffle(items, () => 0)

    expect(result).toEqual([first, second, first])
    expect(result[0]).toBe(first)
    expect(result[1]).toBe(second)
    expect(items).toEqual([first, first, second])
  })
})
