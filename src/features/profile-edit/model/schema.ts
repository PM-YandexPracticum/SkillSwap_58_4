import * as yup from 'yup'
import { VALIDATION } from '@/shared/config'
import {
  birthDateField,
  cityField,
  emailField,
  nameField,
  textField,
} from '@/shared/lib/validation'

/** Схема личных данных на общих полях. Загруженные id ограничивают выбор города справочником. */
export function createProfileSchema(cityIds?: readonly string[]) {
  return yup.object({
    email: emailField(),
    name: nameField(),
    birthDate: birthDateField(),
    /** null — «Не указан»: в макете это допустимый вариант */
    gender: yup.mixed<'male' | 'female'>().oneOf(['male', 'female']).nullable().defined(),
    cityId: cityField(cityIds),
    about: textField(0, VALIDATION.ABOUT.MAX),
  })
}

/** Базовая схема без справочника; в форме используем createProfileSchema с id загруженных городов. */
export const profileSchema = createProfileSchema()
export type ProfileFormValues = yup.InferType<typeof profileSchema>
