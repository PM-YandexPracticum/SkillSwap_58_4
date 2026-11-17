import { createCategory } from '@/entities/category/testing'
import { VALIDATION } from '@/shared/config'
import { createProfileStepSchema, credentialsSchema, profileStepSchema } from './schema'

it('использует общие правила нового пароля и нормализует email', async () => {
  await expect(
    credentialsSchema.validate({ email: 'user@example.com', password: 'abcdefgh' }),
  ).rejects.toThrow('хотя бы одну букву и одну цифру')
  expect(
    await credentialsSchema.validate({ email: ' USER@example.com ', password: 'Abcdefg1' }),
  ).toEqual({ email: 'user@example.com', password: 'Abcdefg1' })
})

beforeEach(() => {
  vi.useFakeTimers({ toFake: ['Date'] })
  vi.setSystemTime(new Date('2026-11-17T12:00:00'))
})
afterEach(() => vi.useRealTimers())

const categories = [
  createCategory({
    subcategories: [
      { id: 'business-management', categoryId: 'business', title: 'Управление командой' },
      ...Array.from({ length: 11 }, (_, i) => ({
        id: `sub-${i}`,
        categoryId: 'business',
        title: `Направление ${i}`,
      })),
    ],
  }),
  createCategory({ id: 'art' }),
]

const valid = {
  name: 'Ирина',
  birthDate: '1995-05-01',
  gender: null,
  cityId: 'moscow',
  learnCategoryIds: ['business'],
  learnSubcategoryIds: ['business-management'],
}

const check = (patch: Record<string, unknown>) =>
  createProfileStepSchema(['moscow', 'spb'], categories).validate({ ...valid, ...patch })

describe('profileStepSchema', () => {
  it('принимает корректные значения; пол можно не указывать', async () => {
    expect(await check({})).toEqual(valid)
    expect(await check({ gender: 'male' })).toMatchObject({ gender: 'male' })
    expect(await check({ gender: 'female' })).toMatchObject({ gender: 'female' })
  })

  it('не принимает неизвестное значение пола', async () => {
    await expect(check({ gender: 'other' })).rejects.toThrow()
  })

  describe('имя', () => {
    it('обрезает пробелы по краям', async () => {
      expect(await check({ name: '  Анна-Мария  ' })).toMatchObject({ name: 'Анна-Мария' })
    })

    it('обязательно: пустое и из одних пробелов', async () => {
      await expect(check({ name: '' })).rejects.toThrow('Введите имя')
      await expect(check({ name: '   ' })).rejects.toThrow('Введите имя')
    })

    it('2–40 символов', async () => {
      await expect(check({ name: 'А' })).rejects.toThrow('Только буквы, пробел и дефис')
      expect(await check({ name: 'Ан' })).toMatchObject({ name: 'Ан' })
      expect(await check({ name: 'А'.repeat(VALIDATION.NAME.MAX) })).toBeTruthy()
      await expect(check({ name: 'А'.repeat(VALIDATION.NAME.MAX + 1) })).rejects.toThrow(
        'Только буквы, пробел и дефис',
      )
    })

    it('только буквы, пробел и дефис', async () => {
      await expect(check({ name: 'Ирина1' })).rejects.toThrow('Только буквы, пробел и дефис')
      await expect(check({ name: 'Ирина!' })).rejects.toThrow('Только буквы, пробел и дефис')
    })
  })

  describe('дата рождения', () => {
    it('обязательна', async () => {
      await expect(check({ birthDate: '' })).rejects.toThrow('Укажите дату рождения')
    })

    it('несуществующая дата не проходит', async () => {
      await expect(check({ birthDate: '1995-02-31' })).rejects.toThrow('Укажите дату рождения')
    })

    it('возраст ровно 14 и ровно 100 лет подходит', async () => {
      expect(await check({ birthDate: '2012-11-17' })).toBeTruthy()
      expect(await check({ birthDate: '1926-11-17' })).toBeTruthy()
    })

    it('младше 14, старше 100 и будущее не подходят', async () => {
      await expect(check({ birthDate: '2012-11-18' })).rejects.toThrow('Возраст от 14 до 100 лет')
      await expect(check({ birthDate: '1925-11-17' })).rejects.toThrow('Возраст от 14 до 100 лет')
      await expect(check({ birthDate: '2026-11-18' })).rejects.toThrow('Возраст от 14 до 100 лет')
    })
  })

  describe('город', () => {
    it('обязателен и должен быть из справочника', async () => {
      await expect(check({ cityId: '' })).rejects.toThrow('Выберите город из списка')
      await expect(check({ cityId: 'unknown' })).rejects.toThrow('Выберите город из списка')
      expect(await check({ cityId: 'spb' })).toMatchObject({ cityId: 'spb' })
    })

    it('без справочника проверяет только обязательность', async () => {
      expect(await profileStepSchema.validate({ ...valid, cityId: 'any' })).toBeTruthy()
      await expect(profileStepSchema.validate({ ...valid, cityId: '' })).rejects.toThrow(
        'Выберите город из списка',
      )
    })
  })

  it.each([null, undefined, 'business'])(
    'не падает при неверном типе списка категорий: %j',
    async (learnCategoryIds) => {
      await expect(check({ learnCategoryIds })).rejects.toMatchObject({ name: 'ValidationError' })
    },
  )

  describe('«Хочу научиться»', () => {
    const ids = (count: number) => Array.from({ length: count }, (_, i) => `sub-${i}`)

    it('нужна хотя бы одна подкатегория', async () => {
      await expect(check({ learnSubcategoryIds: [] })).rejects.toThrow(
        'Выберите хотя бы одно направление',
      )
      expect(await check({ learnSubcategoryIds: ids(1) })).toBeTruthy()
    })

    it('не больше 10 подкатегорий', async () => {
      expect(
        await check({ learnSubcategoryIds: ids(VALIDATION.LEARN_SUBCATEGORIES.MAX) }),
      ).toBeTruthy()
      await expect(
        check({ learnSubcategoryIds: ids(VALIDATION.LEARN_SUBCATEGORIES.MAX + 1) }),
      ).rejects.toThrow('Не больше 10 направлений')
    })

    it.each([
      { learnCategoryIds: ['unknown'] },
      { learnCategoryIds: [] },
      { learnCategoryIds: ['art'] },
      { learnCategoryIds: ['business', 'business'] },
      { learnSubcategoryIds: ['unknown'] },
      { learnSubcategoryIds: ['business-management', 'business-management'] },
    ])('не принимает несогласованный выбор из черновика: %j', async (patch) => {
      await expect(check(patch)).rejects.toThrow('Выберите направления из списка без повторов')
    })

    it('принимает несколько категорий и подкатегорий, в том числе категорию без выбранных подкатегорий', async () => {
      expect(
        await check({
          learnCategoryIds: ['business', 'art'],
          learnSubcategoryIds: ['business-management', 'art-marketing'],
        }),
      ).toBeTruthy()
      expect(await check({ learnCategoryIds: ['business', 'art'] })).toBeTruthy()
    })
  })
})
