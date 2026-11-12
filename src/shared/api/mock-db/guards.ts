import { parseISODateTime } from '@/shared/lib/validation'

/** Небольшие примитивы для runtime-проверки JSON на границе mock API. */
export function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value)
}

export function isString(value: unknown): value is string {
  return typeof value === 'string'
}

export function isStringArray(value: unknown): value is string[] {
  return Array.isArray(value) && value.every(isString)
}

/** Дата JSON должна быть ISO-строкой с существующим календарным днём. */
export function isISODateString(value: unknown): value is string {
  return isString(value) && parseISODateTime(value) !== undefined
}
