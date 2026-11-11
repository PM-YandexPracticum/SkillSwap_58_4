import * as yup from 'yup'
import { emailField, passwordField } from '@/shared/lib/validation'

/**
 * Шаг 1: email + пароль. Уникальность email проверяется отдельно — по загруженным пользователям.
 */
export const credentialsSchema = yup.object({
  email: emailField(),
  password: passwordField().required('Придумайте пароль'),
})
