import * as yup from 'yup'

/** Схема формы «Личные данные» */
export const profileSchema = yup.object({
  email: yup.string().email('Введите корректный email').required(),
  name: yup.string().trim().required('Введите имя'),
  birthDate: yup.string().required('Укажите дату рождения'),
  /** null — «Не указан»: в макете это допустимый вариант */
  gender: yup.mixed<'male' | 'female'>().oneOf(['male', 'female']).nullable().defined(),
  city: yup.string().required('Выберите город'),
  about: yup.string().max(500),
})

export type ProfileFormValues = yup.InferType<typeof profileSchema>
