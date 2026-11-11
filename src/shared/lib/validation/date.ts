import { isValid, parseISO } from 'date-fns'

/** Строгая дата календаря из ISO-формата без времени. */
export function parseISODate(value: string | null | undefined): Date | undefined {
  if (!value || !/^\d{4}-\d{2}-\d{2}$/.test(value)) return undefined

  const [year, month, day] = value.split('-').map(Number)
  const date = parseISO(value)
  const isSameCalendarDate =
    date.getFullYear() === year && date.getMonth() === month - 1 && date.getDate() === day

  return isSameCalendarDate ? date : undefined
}

/** Строгая ISO-дата со временем. Проверяет календарную часть до создания Date. */
export function parseISODateTime(value: string | null | undefined): Date | undefined {
  if (!value) return undefined
  const datePart = /^(\d{4}-\d{2}-\d{2})(?:T.*)?$/.exec(value)?.[1]
  if (!datePart || !parseISODate(datePart)) return undefined

  const date = parseISO(value)
  return isValid(date) ? date : undefined
}

/** Считает полные годы по дате рождения. `now` нужен для детерминированных тестов. */
export function getAge(birthDate: string, now: Date = new Date()): number {
  const birth = parseISODateTime(birthDate)
  if (!birth) {
    throw new RangeError(`getAge: некорректная дата рождения «${birthDate}»`)
  }

  const age = now.getFullYear() - birth.getFullYear()
  const hadBirthdayThisYear =
    now.getMonth() > birth.getMonth() ||
    (now.getMonth() === birth.getMonth() && now.getDate() >= birth.getDate())

  return Math.max(0, hadBirthdayThisYear ? age : age - 1)
}
