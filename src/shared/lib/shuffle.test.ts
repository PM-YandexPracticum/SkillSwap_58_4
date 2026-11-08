import { describe, test, expect } from 'vitest'
import { shuffle } from './shuffle'

describe('shuffle', () => {
  test('не мутирует исходный массив', () => {
    const original = [1, 2, 3, 4, 5]
    const copy = [...original]

    shuffle(original)

    expect(original).toEqual(copy)
  })

  test('возвращает новый массив', () => {
    const original = [1, 2, 3]

    const result = shuffle(original)

    expect(result).not.toBe(original)
  })

  test('возвращает массив той же длины', () => {
    const items = [1, 2, 3, 4, 5]

    const result = shuffle(items)

    expect(result).toHaveLength(items.length)
  })

  test('содержит те же элементы', () => {
    const items = [1, 2, 3, 4, 5]

    const result = shuffle(items)

    expect(result.sort()).toEqual(items.sort())
  })

  test('работает с пустым массивом', () => {
    const result = shuffle([])

    expect(result).toEqual([])
  })

  test('работает с массивом из одного элемента', () => {
    const result = shuffle([42])

    expect(result).toEqual([42])
  })

  test('предсказуемый результат при подмене _random', () => {
    const items = [1, 2, 3, 4]

    const mockRandom = () => 0

    const result = shuffle(items, mockRandom)

    expect(result).toEqual([2, 3, 4, 1])
  })

  test('перемешивает массив (не оставляет в исходном порядке)', () => {
    const items = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]

    const results = Array.from({ length: 10 }, () => shuffle(items))

    const allSameAsOriginal = results.every((r) => JSON.stringify(r) === JSON.stringify(items))

    expect(allSameAsOriginal).toBe(false)
  })
})
