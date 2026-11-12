import { getAge, parseISODate, parseISODateTime } from './date'

const NOW = new Date(2026, 10, 11, 12)

describe('общие календарные даты', () => {
  it.each(['2000-02-31', '2001-02-29', '2000-04-31', '2000-2-01', 'not-a-date'])(
    'не нормализует неправильную дату %s',
    (value) => {
      expect(parseISODate(value)).toBeUndefined()
      expect(parseISODateTime(value)).toBeUndefined()
      expect(() => getAge(value, NOW)).toThrow(RangeError)
    },
  )

  it('разбирает день в локальном календаре без сдвига часового пояса', () => {
    expect(parseISODate('2000-02-29')).toEqual(new Date(2000, 1, 29))
  })

  it('принимает ISO timestamp и отклоняет ошибочное время', () => {
    expect(parseISODateTime('2000-02-29T12:00:00.000Z')).toEqual(
      new Date('2000-02-29T12:00:00.000Z'),
    )
    expect(parseISODateTime('2000-02-29T99:00:00Z')).toBeUndefined()
  })

  it('прибавляет год только в день рождения; будущая дата даёт 0', () => {
    expect(getAge('2000-11-10', NOW)).toBe(26)
    expect(getAge('2000-11-11', NOW)).toBe(26)
    expect(getAge('2000-11-12', NOW)).toBe(25)
    expect(getAge('2030-01-01', NOW)).toBe(0)
  })
})
