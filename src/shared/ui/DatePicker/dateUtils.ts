import { format, isValid, parse, parseISO, startOfDay } from 'date-fns'

export const ISO_FORMAT = 'yyyy-MM-dd'
export const DISPLAY_FORMAT = 'dd.MM.yyyy'

/** Строгая ISO-дата без времени; некорректное значение не нормализуется. */
export function parseDate(value: string | null | undefined) {
  if (!value || !/^\d{4}-\d{2}-\d{2}$/.test(value)) return undefined
  const date = parseISO(value)
  return isValid(date) ? date : undefined
}

/** Полный ручной ввод дд.мм.гггг, включая проверку существования дня. */
export function parseDisplayDate(text: string) {
  const date = parse(text, DISPLAY_FORMAT, new Date(2000, 0, 1))
  return isValid(date) && format(date, DISPLAY_FORMAT) === text ? date : undefined
}

/** Включительные границы, сравнение по локальному календарному дню. */
export function isAllowed(date: Date, min?: Date, max?: Date) {
  const day = startOfDay(date)
  return (!min || day >= min) && (!max || day <= max)
}
