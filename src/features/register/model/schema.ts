import * as yup from 'yup'
import { VALIDATION } from '@/shared/config'

/**
 * Шаг 1: email + пароль. Уникальность email проверяется отдельно — по загруженным пользователям.
 * TODO: перейти на emailField() / passwordField() из @/shared/lib/validation
 */
export const credentialsSchema = yup.object({
  email: yup.string().trim().email('Введите корректный email').required('Введите email'),
  password: yup
    .string()
    .min(
      VALIDATION.PASSWORD.MIN,
      `Пароль должен содержать не менее ${VALIDATION.PASSWORD.MIN} знаков`,
    )
    .required('Придумайте пароль'),
})

// TODO: profileSchema (шаг 2): аватар, имя, дата рождения, пол, город, «Хочу научиться» (1–10)
// TODO: skillSchema (шаг 3): один навык — категория, подкатегория, название, описание, фото (1–4)
