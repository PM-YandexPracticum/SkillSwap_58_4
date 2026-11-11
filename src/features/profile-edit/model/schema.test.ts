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
