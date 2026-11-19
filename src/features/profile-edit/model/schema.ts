import * as yup from 'yup'
import { VALIDATION } from '@/shared/config'
import {
  birthDateField,
  cityField,
  emailField,
  nameField,
  passwordField,
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
    about: textField(0, VALIDATION.ABOUT.MAX).default(''),
  })
}

/** Базовая схема без справочника; в форме используем createProfileSchema с id загруженных городов. */
export const profileSchema = createProfileSchema()
export type ProfileFormValues = yup.InferType<typeof profileSchema>

/** Схема редактора: фото — часть общей записи, новый пароль проверяем только при его изменении. */
export function createProfileEditSchema(cityIds?: readonly string[], changePassword = false) {
  return createProfileSchema(cityIds).shape({
    avatarUrl: yup.string().nullable().defined(),
    password: changePassword ? passwordField() : yup.string().strip(),
  })
}

export type ProfileEditValues = yup.InferType<ReturnType<typeof createProfileEditSchema>>
