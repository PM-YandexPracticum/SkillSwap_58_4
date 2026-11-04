import { formatNotificationDate } from './formatNotificationDate'

/** «Сейчас» — фиксировано, иначе тест сломается завтра. */
const NOW = new Date('2026-11-04T12:00:00')

describe('formatNotificationDate', () => {
  it('возвращает «Сегодня» для текущего дня', () => {
    expect(formatNotificationDate('2026-11-04T09:00:00', NOW)).toBe('Сегодня')
  })

  it('возвращает «Сегодня» даже за пару часов до полуночи', () => {
    expect(formatNotificationDate('2026-11-04T00:30:00', NOW)).toBe('Сегодня')
  })

  it('возвращает «Вчера» для предыдущего дня', () => {
    expect(formatNotificationDate('2026-11-03T23:30:00', NOW)).toBe('Вчера')
  })

  it('возвращает «Вчера» на границе месяца', () => {
    const now = new Date('2026-11-01T12:00:00')
    expect(formatNotificationDate('2026-10-31T12:00:00', now)).toBe('Вчера')
  })

  it('возвращает день и месяц в родительном падеже для старых дат', () => {
    expect(formatNotificationDate('2026-10-22T10:00:00', NOW)).toBe('22 октября')
  })

  it('не показывает год даже для прошлогодних', () => {
    expect(formatNotificationDate('2025-03-01T10:00:00', NOW)).toBe('1 марта')
  })
})
