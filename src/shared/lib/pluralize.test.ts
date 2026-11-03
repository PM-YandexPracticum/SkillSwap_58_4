import { pluralize } from './pluralize'

const YEARS = ['год', 'года', 'лет'] as const

describe('pluralize', () => {
  it.each([
    { count: 1, expected: 'год' },
    { count: 21, expected: 'год' },
    { count: 101, expected: 'год' },
    { count: 2, expected: 'года' },
    { count: 4, expected: 'года' },
    { count: 34, expected: 'года' },
    { count: 0, expected: 'лет' },
    { count: 5, expected: 'лет' },
    { count: 20, expected: 'лет' },
    { count: 100, expected: 'лет' },
  ])('$count → $expected', ({ count, expected }) => {
    expect(pluralize(count, YEARS)).toBe(expected)
  })

  it.each([11, 12, 13, 14, 111, 112, 114])('%i — исключение «-надцать» → «лет»', (count) => {
    expect(pluralize(count, YEARS)).toBe('лет')
  })
})
