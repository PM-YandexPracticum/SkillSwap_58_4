import * as yup from 'yup'
import { VALIDATION } from '@/shared/config'

/**
 * Схема формы входа. На входе проверяем только заполненность и формат —
 * подробные требования к паролю показываем при регистрации.
 * TODO: перейти на emailField() из @/shared/lib/validation
 */
export const loginSchema = yup.object({
  email: yup
    .string()
    .trim()
    .email('Введите корректный email')
    .max(VALIDATION.EMAIL.MAX)
    .required('Введите email'),
  password: yup.string().required('Введите пароль'),
})

export type LoginFormValues = yup.InferType<typeof loginSchema>
