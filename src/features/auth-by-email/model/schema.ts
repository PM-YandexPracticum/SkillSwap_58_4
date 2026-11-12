import * as yup from 'yup'
import { emailField, requiredPasswordField } from '@/shared/lib/validation'

/**
 * Схема формы входа. На входе проверяем только заполненность и формат —
 * подробные требования к новому паролю показываем при регистрации.
 */
export const loginSchema = yup.object({
  email: emailField(),
  password: requiredPasswordField(),
})

export type LoginFormValues = yup.InferType<typeof loginSchema>
