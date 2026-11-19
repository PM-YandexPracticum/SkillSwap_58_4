import { profileSchema, createProfileSchema } from './schema'

const valid = {
  email: 'test@example.com',
  name: 'Иван',
  birthDate: '2000-02-29',
  gender: null,
  cityId: 'moscow',
  about: '',
}

it('использует общие проверки имени, календарной даты и текста', async () => {
  expect(await profileSchema.isValid(valid)).toBe(true)
  expect(await profileSchema.isValid({ ...valid, birthDate: '2000-02-31' })).toBe(false)
  expect(await profileSchema.isValid({ ...valid, name: 'Иван1' })).toBe(false)
  expect(await profileSchema.isValid({ ...valid, about: 'а'.repeat(501) })).toBe(false)
})

it('проверяет cityId по переданному справочнику', async () => {
  const schema = createProfileSchema(['moscow'])
  expect(await schema.isValid(valid)).toBe(true)
  expect(await schema.isValid({ ...valid, cityId: 'unknown' })).toBe(false)
  expect(await createProfileSchema([]).isValid(valid)).toBe(false)
})

describe('схема редактирования профиля', () => {
  it.each(['abcdefgh', '12345678', 'Pass 123', 'a1'.repeat(33)])(
    'применяет общие правила к новому паролю: %s',
    async (password) => {
      const { createProfileEditSchema } = await import('./schema')
      expect(
        await createProfileEditSchema(['moscow'], true).isValid({
          ...valid,
          avatarUrl: null,
          password,
        }),
      ).toBe(false)
    },
  )

  it('нормализует поля и не сохраняет пароль после отмены его изменения', async () => {
    const { createProfileEditSchema } = await import('./schema')
    const values = await createProfileEditSchema(['moscow'], false).validate({
      ...valid,
      email: ' TEST@EXAMPLE.COM ',
      name: ' Иван ',
      about: '   ',
      avatarUrl: null,
      password: 'old draft',
    })
    expect(values).toMatchObject({
      email: 'test@example.com',
      name: 'Иван',
      about: '',
      avatarUrl: null,
    })
    expect(values).not.toHaveProperty('password')
  })
})
