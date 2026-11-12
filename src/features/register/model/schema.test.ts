import { credentialsSchema } from './schema'

it('использует общие правила нового пароля и нормализует email', async () => {
  await expect(
    credentialsSchema.validate({ email: 'user@example.com', password: 'abcdefgh' }),
  ).rejects.toThrow('хотя бы одну букву и одну цифру')
  expect(
    await credentialsSchema.validate({ email: ' USER@example.com ', password: 'Abcdefg1' }),
  ).toEqual({ email: 'user@example.com', password: 'Abcdefg1' })
})
