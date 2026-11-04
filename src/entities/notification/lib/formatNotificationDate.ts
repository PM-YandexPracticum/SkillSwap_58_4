/** Один и тот же календарный день — сравнение по году, месяцу и числу. */
const isSameDay = (a: Date, b: Date): boolean =>
  a.getFullYear() === b.getFullYear() &&
  a.getMonth() === b.getMonth() &&
  a.getDate() === b.getDate()

/**
 * Дата уведомления в формате макета 1:2190:
 * «Сегодня», «Вчера» или «22 октября» (без года).
 * `now` — для тестов с фиксированным временем.
 */
export function formatNotificationDate(iso: string, now: Date = new Date()): string {
  const date = new Date(iso)

  if (isSameDay(date, now)) return 'Сегодня'

  const yesterday = new Date(now)
  yesterday.setDate(now.getDate() - 1)

  if (isSameDay(date, yesterday)) return 'Вчера'

  return new Intl.DateTimeFormat('ru-RU', {
    day: 'numeric',
    month: 'long',
  }).format(date)
}
