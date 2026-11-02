import { describe, expect, it } from 'vitest'
import { getAge } from './getAge'

const isoDate = (year: number, month: number, day: number) =>
  new Date(year, month - 1, day, 12).toISOString()

const NOW = new Date(2026, 9, 30, 12)

describe('getAge', () => {
  it('считает полные годы, если день рождения в этом году уже был', () => {
    expect(getAge(isoDate(1992, 3, 15), NOW)).toBe(34)
  })

  it('не добавляет год, пока день рождения не наступил', () => {
    expect(getAge(isoDate(1992, 12, 1), NOW)).toBe(33)
  })

  it.each([
    { case: 'вчера', birth: isoDate(2000, 10, 29), expected: 26 },
    { case: 'сегодня', birth: isoDate(2000, 10, 30), expected: 26 },
    { case: 'завтра', birth: isoDate(2000, 10, 31), expected: 25 },
  ])('день рождения $case → $expected', ({ birth, expected }) => {
    expect(getAge(birth, NOW)).toBe(expected)
  })

  it('29 февраля: в невисокосный год возраст прибавляется 1 марта', () => {
    const birth = isoDate(2000, 2, 29)

    expect(getAge(birth, new Date(2025, 1, 28, 12))).toBe(24)
    expect(getAge(birth, new Date(2025, 2, 1, 12))).toBe(25)
  })

  it('возвращает 0 для ребёнка до года и для даты из будущего', () => {
    expect(getAge(isoDate(2026, 5, 1), NOW)).toBe(0)
    expect(getAge(isoDate(2030, 1, 1), NOW)).toBe(0)
  })

  it('без второго аргумента считает от текущей даты', () => {
    // 1 января десять лет назад: день рождения в этом году уже точно был
    const birth = isoDate(new Date().getFullYear() - 10, 1, 1)

    expect(getAge(birth)).toBe(10)
  })

  it('бросает RangeError на некорректную дату', () => {
    expect(() => getAge('не дата', NOW)).toThrow(RangeError)
  })
})
