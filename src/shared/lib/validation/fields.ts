import * as yup from 'yup'
import { VALIDATION } from '@/shared/config/validation'
import { getAge, parseISODateTime } from './date'

/**
 * Готовые yup-поля для форм. Каждая форма собирает схему из них, а не пишет правила заново -
 * так тексты ошибок и лимиты везде одинаковые. Лимиты - из `VALIDATION` (`@/shared/config`).
 * Правила и тексты ошибок — `docs/rules/validation.md`.
 */

const { EMAIL, PASSWORD, NAME, AGE } = VALIDATION

/** Регулярка "хотя бы одна буква" (кириллица/латиница) */
const HAS_LETTER = /[A-Za-zА-Яа-яЁё]/
/** Регулярка "хотя бы одна цифра" */
const HAS_DIGIT = /\d/
/** Пробелы внутри пароля запрещены (любые пробельные символы) */
const HAS_WHITESPACE = /\s/

/** Проверяет, что строка — корректная ISO-дата с существующим календарным днём. */
function parseBirthDate(value: string): Date | null {
  if (!value) return null
  return parseISODateTime(value) ?? null
}

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

/** Email: обязателен, корректный формат, до 254 символов, обрезка пробелов, нижний регистр */
export function emailField(): yup.StringSchema<string> {
  return yup
    .string()
    .trim()
    .lowercase()
    .required('Введите email')
    .max(EMAIL.MAX, 'Введите корректный email')
    .matches(EMAIL_PATTERN, 'Введите корректный email')
}

/** Пароль: 8–64, хотя бы одна буква и одна цифра, без пробелов */
export function passwordField(): yup.StringSchema<string> {
  return yup
    .string()
    .required('Пароль должен содержать не менее 8 знаков')
    .min(PASSWORD.MIN, 'Пароль должен содержать не менее 8 знаков')
    .max(PASSWORD.MAX, 'Пароль должен содержать не более 64 знаков')
    .test(
      'password-no-whitespace',
      'Пароль не должен содержать пробелов',
      (value) => !value || !HAS_WHITESPACE.test(value),
    )
    .test(
      'password-letter-and-digit',
      'Пароль должен содержать хотя бы одну букву и одну цифру',
      (value) => !value || (HAS_LETTER.test(value) && HAS_DIGIT.test(value)),
    )
}

/** Пароль при входе: принимаем любой сохранённый пароль, но не пустое значение. */
export function requiredPasswordField(): yup.StringSchema<string> {
  return yup.string().required('Введите пароль')
}

/** Имя: 2–40, только буквы, пробел и дефис */
export function nameField(): yup.StringSchema<string> {
  return yup
    .string()
    .trim()
    .required('Введите имя')
    .min(NAME.MIN, 'Только буквы, пробел и дефис')
    .max(NAME.MAX, 'Только буквы, пробел и дефис')
    .matches(NAME.PATTERN, 'Только буквы, пробел и дефис')
}

/** Дата рождения (ISO): возраст от 14 до 100 лет, не в будущем */
export function birthDateField(): yup.StringSchema<string> {
  return yup
    .string()
    .trim()
    .required('Укажите дату рождения')
    .test(
      'birth-date-valid',
      'Укажите дату рождения',
      (value) => parseBirthDate(value ?? '') !== null,
    )
    .test('birth-date-not-future', 'Возраст от 14 до 100 лет', (value) => {
      const date = parseBirthDate(value ?? '')
      if (!date) return true
      return date.getTime() <= Date.now()
    })
    .test('birth-date-age-range', 'Возраст от 14 до 100 лет', (value) => {
      const date = parseBirthDate(value ?? '')
      if (!date) return true
      const age = getAge(value ?? '')
      return age >= AGE.MIN && age <= AGE.MAX
    })
}

/** Текст с ограничением длины ("О себе", описание навыка). Пустые пробелы не считаются текстом */
export function textField(min: number, max: number): yup.StringSchema<string | undefined> {
  return yup
    .string()
    .transform((value) => {
      const trimmed = value?.trim()
      return trimmed ? trimmed : undefined
    })
    .test('text-min', `Расскажите подробнее - от ${min} символов`, (value) =>
      value === undefined ? true : value.length >= min,
    )
    .test('text-max', `Не больше ${max} символов`, (value) =>
      value === undefined ? true : value.length <= max,
    )
}

/** Город — только id из справочника городов. */
export function cityField(cityIds?: readonly string[]): yup.StringSchema<string> {
  const schema = yup.string().trim().required('Выберите город из списка')

  return cityIds === undefined ? schema : schema.oneOf([...cityIds], 'Выберите город из списка')
}

/** Обязательное название навыка: те же общие ограничения длины, с текстом из validation.md. */
export function skillTitleField(): yup.StringSchema<string> {
  const { MIN, MAX } = VALIDATION.SKILL_TITLE
  const message = `От ${MIN} до ${MAX} символов`
  return yup.string().trim().required('Введите название навыка').min(MIN, message).max(MAX, message)
}
