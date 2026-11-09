import { isAllowed, parseDate, parseDisplayDate } from './dateUtils'

describe('parseDate', () => {
  it.each([null, undefined, '', '2000-02-30', '2001-02-29', 'not-a-date', '2000-2-01'])(
    'отбрасывает некорректную ISO-дату %s',
    (value) => expect(parseDate(value)).toBeUndefined(),
  )
  it('принимает 29 февраля високосного года без сдвига часового пояса', () => {
    const date = parseDate('2000-02-29')!
    expect([date.getFullYear(), date.getMonth(), date.getDate(), date.getHours()]).toEqual([
      2000, 1, 29, 0,
    ])
  })
})

describe('parseDisplayDate', () => {
  it.each(['31.04.2000', '29.02.2001', '1.01.2000', '01.01.00', ' 01.01.2000', '01.01.2000 '])(
    'не нормализует ошибочный ввод %s',
    (value) => expect(parseDisplayDate(value)).toBeUndefined(),
  )
  it('принимает точный формат дд.мм.гггг', () => {
    expect(parseDisplayDate('29.02.2000')).toEqual(parseDate('2000-02-29'))
  })
})

describe('isAllowed', () => {
  it.each([
    ['2000-04-14', false],
    ['2000-04-15', true],
    ['2000-04-16', true],
    ['2000-04-17', false],
  ])('учитывает включительные границы для %s', (value, allowed) => {
    expect(
      isAllowed(parseDate(value as string)!, parseDate('2000-04-15'), parseDate('2000-04-16')),
    ).toBe(allowed)
  })
  it('без границ разрешает валидную дату', () =>
    expect(isAllowed(parseDate('2000-01-01')!)).toBe(true))
})
