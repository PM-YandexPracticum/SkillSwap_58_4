import * as yup from 'yup'
import {
  emailField,
  passwordField,
  nameField,
  birthDateField,
  textField,
  cityField,
} from './fields'
import { VALIDATION } from '@/shared/config/validation'
import { afterEach, beforeEach, vi } from 'vitest'

const NOW = new Date('2026-11-03T12:00:00.000Z')

beforeEach(() => {
  vi.useFakeTimers()
  vi.setSystemTime(NOW)
})

afterEach(() => {
  vi.useRealTimers()
})

/** Валидирует значение через схему одного поля и возвращает сообщение ошибки (или null) */
async function validateField<T>(schema: yup.Schema<T>, value: unknown): Promise<string | null> {
  try {
    await schema.validate(value)
    return null
  } catch (err) {
    if (err instanceof yup.ValidationError) return err.message
    throw err
  }
}

/** Проходит ли значение валидацию */
async function isValid<T>(schema: yup.Schema<T>, value: unknown): Promise<boolean> {
  return (await validateField(schema, value)) === null
}

const { EMAIL, PASSWORD, NAME, AGE } = VALIDATION

describe('emailField', () => {
  const schema = emailField()

  it('принимает корректный email', async () => {
    expect(await isValid(schema, 'user@example.com')).toBe(true)
  })

  it('обрезает пробелы по краям', async () => {
    expect(await schema.validate('  user@example.com  ')).toBe('user@example.com')
  })

  it('приводит email к нижнему регистру', async () => {
    expect(await schema.validate('User@Example.COM')).toBe('user@example.com')
  })

  it('требует email', async () => {
    expect(await validateField(schema, '')).toBe('Введите email')
    expect(await validateField(schema, undefined)).toBe('Введите email')
  })

  it.each([
    { case: 'нет @', value: 'user.example.com' },
    { case: 'нет домена', value: 'user@' },
    { case: 'нет зоны', value: 'user@example' },
    { case: 'пробел внутри', value: 'user @example.com' },
  ])('отклоняет некорректный email: $case', async ({ value }) => {
    expect(await validateField(schema, value)).toBe('Введите корректный email')
  })

  it('отклоняет email длиннее максимума', async () => {
    const local = 'a'.repeat(EMAIL.MAX)
    const value = `${local}@example.com`
    expect(await validateField(schema, value)).toBe('Введите корректный email')
  })

  it('принимает email ровно на границе максимума', async () => {
    const domain = '@example.com'
    const local = 'a'.repeat(EMAIL.MAX - domain.length)
    expect(await isValid(schema, `${local}${domain}`)).toBe(true)
  })
})

describe('passwordField', () => {
  const schema = passwordField()

  it('принимает корректный пароль', async () => {
    expect(await isValid(schema, 'abcdefg1')).toBe(true)
    expect(await isValid(schema, 'Пароль123')).toBe(true)
  })

  it('принимает пароль ровно 8 символов', async () => {
    expect(await isValid(schema, 'abc12345')).toBe(true)
  })

  it('принимает пароль ровно 64 символа', async () => {
    const value = 'a1' + 'b'.repeat(PASSWORD.MAX - 2)
    expect(await isValid(schema, value)).toBe(true)
  })

  it('требует пароль', async () => {
    expect(await validateField(schema, '')).toBe('Пароль должен содержать не менее 8 знаков')
  })

  it('отклоняет пароль короче 8 символов', async () => {
    expect(await validateField(schema, 'ab1')).toBe('Пароль должен содержать не менее 8 знаков')
  })

  it('отклоняет пароль длиннее 64 символов', async () => {
    const value = 'a1' + 'b'.repeat(PASSWORD.MAX - 1)
    expect(await validateField(schema, value)).toBe('Пароль должен содержать не более 64 знаков')
  })

  it.each([
    { case: 'только буквы', value: 'abcdefgh' },
    { case: 'только цифры', value: '12345678' },
  ])('отклоняет пароль без буквы/цифры: $case', async ({ value }) => {
    expect(await validateField(schema, value)).toBe(
      'Пароль должен содержать хотя бы одну букву и одну цифру',
    )
  })

  it('отклоняет пароль с пробелом', async () => {
    expect(await validateField(schema, 'abc 1234')).toBe('Пароль не должен содержать пробелов')
  })
})

describe('nameField', () => {
  const schema = nameField()

  it.each([
    { case: 'кириллица', value: 'Иван' },
    { case: 'латиница', value: 'Ivan' },
    { case: 'двойное имя через пробел', value: 'Иван Петров' },
    { case: 'двойная фамилия через дефис', value: 'Иванова-Петрова' },
    { case: 'Ё', value: 'Ёлка' },
    { case: '2 символа - граница', value: 'Ян' },
    { case: '40 символов - граница', value: 'А'.repeat(NAME.MAX) },
  ])('принимает корректное имя: $case', async ({ value }) => {
    expect(await isValid(schema, value)).toBe(true)
  })

  it('обрезает пробелы по краям', async () => {
    expect(await schema.validate('  Иван  ')).toBe('Иван')
  })

  it('требует имя', async () => {
    expect(await validateField(schema, '')).toBe('Введите имя')
    expect(await validateField(schema, '   ')).toBe('Введите имя')
  })

  it('отклоняет имя короче 2 символов', async () => {
    expect(await validateField(schema, 'Я')).toBe('Только буквы, пробел и дефис')
  })

  it('отклоняет имя длиннее 40 символов', async () => {
    expect(await validateField(schema, 'А'.repeat(NAME.MAX + 1))).toBe(
      'Только буквы, пробел и дефис',
    )
  })

  it.each([
    { case: 'цифры', value: 'Иван1' },
    { case: 'начинается с дефиса', value: '-Иван' },
    { case: 'спецсимволы', value: 'Иван!' },
    { case: 'точка', value: 'И.Петров' },
    { case: 'пробел в начале после trim', value: '  1Иван' },
  ])('отклоняет недопустимые символы: $case', async ({ value }) => {
    expect(await validateField(schema, value)).toBe('Только буквы, пробел и дефис')
  })
})

describe('birthDateField', () => {
  const schema = birthDateField()

  const isoDate = (year: number, month: number, day: number) =>
    new Date(year, month - 1, day, 12).toISOString()

  /** Возраст ровно N лет на фиксированную дату */
  const birthOfAge = (age: number): string => {
    const year = NOW.getFullYear() - age
    return new Date(Date.UTC(year, 5, 15, 12)).toISOString()
  }

  it('требует дату', async () => {
    expect(await validateField(schema, '')).toBe('Укажите дату рождения')
    expect(await validateField(schema, undefined)).toBe('Укажите дату рождения')
  })

  it('отклоняет дату из пробелов', async () => {
    expect(await validateField(schema, '   ')).toBe('Укажите дату рождения')
  })

  it('обрезает пробелы по краям даты', async () => {
    const value = '2000-06-15T12:00:00.000Z'
    expect(await schema.validate(`  ${value}  `)).toBe(value)
  })

  it('отклоняет невалидную дату', async () => {
    expect(await validateField(schema, 'не дата')).toBe('Укажите дату рождения')
  })

  it('отклоняет дату из будущего', async () => {
    const future = new Date(NOW.getTime() + 1000 * 60 * 60 * 24 * 365)
    expect(await validateField(schema, future.toISOString())).toBe('Возраст от 14 до 100 лет')
  })

  it.each([
    { case: 'ровно 14 лет — граница снизу', age: AGE.MIN, ok: true },
    { case: '13 лет — за границей', age: AGE.MIN - 1, ok: false },
    { case: 'ровно 100 лет — граница сверху', age: AGE.MAX, ok: true },
    { case: '101 год — за границей', age: AGE.MAX + 1, ok: false },
  ])('возраст $case', async ({ age, ok }) => {
    const message = await validateField(schema, birthOfAge(age))
    if (ok) {
      expect(message).toBeNull()
    } else {
      expect(message).toBe('Возраст от 14 до 100 лет')
    }
  })

  it('не добавляет год, пока день рождения в этом году не наступил', async () => {
    const value = new Date(Date.UTC(NOW.getFullYear() - AGE.MIN, 11, 4, 12)).toISOString()

    expect(await validateField(schema, value)).toBe('Возраст от 14 до 100 лет')
  })

  it('29 февраля: принимает корректную високосную дату', async () => {
    const year = 2012
    const value = isoDate(year, 2, 29)

    expect(await isValid(schema, value)).toBe(true)
  })
})

describe('textField', () => {
  const { MIN, MAX } = VALIDATION.SKILL_DESCRIPTION
  const schema = textField(MIN, MAX)

  it('принимает текст в границах', async () => {
    expect(await isValid(schema, 'а'.repeat(MIN))).toBe(true)
    expect(await isValid(schema, 'а'.repeat(MAX))).toBe(true)
  })

  it('пустая строка -> undefined (поле необязательное)', async () => {
    expect(await schema.validate('')).toBeUndefined()
    expect(await schema.validate('   ')).toBeUndefined()
    expect(await schema.validate(undefined)).toBeUndefined()
  })

  it('обрезает пробелы по краям', async () => {
    const value = 'а'.repeat(MIN)
    expect(await schema.validate(`  ${value}  `)).toBe(value)
  })

  it('отклоняет текст короче минимума', async () => {
    expect(await validateField(schema, 'а'.repeat(MIN - 1))).toBe(
      `Расскажите подробнее - от ${MIN} символов`,
    )
  })

  it('отклоняет текст длиннее максимума', async () => {
    expect(await validateField(schema, 'а'.repeat(MAX + 1))).toBe(`Не больше ${MAX} символов`)
  })

  it('пробелы по краям не увеличивают длину', async () => {
    const value = `  ${'а'.repeat(MAX)}  `
    expect(await isValid(schema, value)).toBe(true)
  })
})

describe('cityField', () => {
  const cityIds = ['moscow', 'spb', 'kazan'] as const
  const schema = cityField(cityIds)

  it('принимает id из справочника', async () => {
    expect(await isValid(schema, 'moscow')).toBe(true)
    expect(await isValid(schema, 'kazan')).toBe(true)
  })

  it('требует город', async () => {
    expect(await validateField(schema, '')).toBe('Выберите город из списка')
    expect(await validateField(schema, undefined)).toBe('Выберите город из списка')
  })

  it('отклоняет строку из пробелов', async () => {
    expect(await validateField(schema, '   ')).toBe('Выберите город из списка')
  })

  it('обрезает пробелы по краям id города', async () => {
    expect(await schema.validate('  moscow  ')).toBe('moscow')
  })

  it('отклоняет id, которого нет в справочнике', async () => {
    expect(await validateField(schema, 'unknown')).toBe('Выберите город из списка')
  })

  it('работает с пустым справочником', async () => {
    const empty = cityField([])
    expect(await validateField(empty, 'moscow')).toBe('Выберите город из списка')
  })
})
