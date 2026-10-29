import type * as yup from 'yup'

/**
 * Готовые yup-поля для форм. Каждая форма собирает схему из них, а не пишет правила заново —
 * так тексты ошибок и лимиты везде одинаковые. Лимиты — из `VALIDATION` (`@/shared/config`).
 * Правила и тексты ошибок — `docs/rules/validation.md`.
 *
 * Пока поля не реализованы, формы используют временные схемы в своих `model/schema.ts`.
 */

/** Email: обязателен, корректный формат, до 254 символов, обрезка пробелов, нижний регистр */
export function emailField(): yup.StringSchema<string> {
  throw new Error('Not implemented: emailField')
}

/** Пароль: 8–64, хотя бы одна буква и одна цифра, без пробелов */
export function passwordField(): yup.StringSchema<string> {
  throw new Error('Not implemented: passwordField')
}

/** Имя: 2–40, только буквы, пробел и дефис */
export function nameField(): yup.StringSchema<string> {
  throw new Error('Not implemented: nameField')
}

/** Дата рождения (ISO): возраст от 14 до 100 лет, не в будущем */
export function birthDateField(): yup.StringSchema<string> {
  throw new Error('Not implemented: birthDateField')
}

/** Текст с ограничением длины («О себе», описание навыка). Пустые пробелы не считаются текстом */
export function textField(_min: number, _max: number): yup.StringSchema<string | undefined> {
  throw new Error('Not implemented: textField')
}

/**
 * Город — только id из справочника городов.
 * @param cityIds допустимые id (из store, `entities/city`) — shared сам сущности не знает
 */
export function cityField(_cityIds: readonly string[]): yup.StringSchema<string> {
  throw new Error('Not implemented: cityField')
}
