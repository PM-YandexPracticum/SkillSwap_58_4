import { loginSchema } from './schema'

it('нормализует email, но на входе не требует сложности нового пароля', async () => {
  expect(await loginSchema.validate({ email: ' USER@example.com ', password: 'old' })).toEqual({
    email: 'user@example.com',
    password: 'old',
  })
  await expect(loginSchema.validate({ email: 'user@example.com', password: '' })).rejects.toThrow(
    'Введите пароль',
  )
})
