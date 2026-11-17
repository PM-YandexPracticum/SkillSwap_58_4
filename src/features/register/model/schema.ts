import * as yup from 'yup'
import { syncCategorySelection, type Category } from '@/entities/category'
import type { Gender } from '@/entities/user'
import { VALIDATION } from '@/shared/config'
import {
  birthDateField,
  cityField,
  emailField,
  nameField,
  passwordField,
} from '@/shared/lib/validation'

/**
 * Шаг 1: email + пароль. Уникальность email проверяется отдельно — по загруженным пользователям.
 */
export const credentialsSchema = yup.object({
  email: emailField(),
  password: passwordField().required('Придумайте пароль'),
})

/**
 * Шаг 2: имя, дата рождения (возраст 14–100), пол, город и «Хочу научиться» (1–10 подкатегорий).
 * Все правила — общие поля `@/shared/lib/validation` и `VALIDATION`, тексты — `docs/rules/validation.md`.
 * `gender: null` — «Не указан»: в макете это допустимый вариант. Загруженные id ограничивают выбор города
 * справочником. «О себе» на этом шаге нет — только в профиле. Аватар необязателен и проверяется при выборе
 * файла (`validateImageFile` в `AvatarUpload`), поэтому в схему не входит.
 * Связь «категория ↔ подкатегория» обеспечивает `CategorySubcategorySelect` (P6-03).
 * Схема сверяет и восстановленный черновик со справочником через тот же `syncCategorySelection`:
 * неизвестные id, повторы и подкатегории без своей выбранной категории не принимаются.
 */
export function createProfileStepSchema(
  cityIds?: readonly string[],
  categories?: readonly Category[],
) {
  const { MIN, MAX } = VALIDATION.LEARN_SUBCATEGORIES
  const learningSelection = (value: readonly string[] | undefined, context: yup.TestContext) => {
    if (!categories) return true
    const parent = context.parent as {
      learnCategoryIds: readonly string[]
    }
    // Ошибку типа массива отдаёт само Yup, нормализатор получает только массивы.
    if (!Array.isArray(parent.learnCategoryIds)) return true
    const selection = {
      categoryIds: parent.learnCategoryIds,
      subcategoryIds: value ?? [],
    }
    const normalized = syncCategorySelection(categories, selection, selection)
    const matches =
      categories.length > 0 &&
      normalized.categoryIds.length === selection.categoryIds.length &&
      normalized.subcategoryIds.length === selection.subcategoryIds.length &&
      normalized.categoryIds.every((id, index) => id === selection.categoryIds[index]) &&
      normalized.subcategoryIds.every((id, index) => id === selection.subcategoryIds[index])
    return (
      matches || context.createError({ message: 'Выберите направления из списка без повторов' })
    )
  }

  return yup.object({
    name: nameField(),
    birthDate: birthDateField(),
    gender: yup.mixed<Gender>().oneOf(['male', 'female']).nullable().defined(),
    cityId: cityField(cityIds),
    /** Отмеченные категории — нужны только для фильтра подкатегорий */
    learnCategoryIds: yup.array().of(yup.string().defined()).defined(),
    learnSubcategoryIds: yup
      .array()
      .of(yup.string().defined())
      .defined()
      .min(MIN, 'Выберите хотя бы одно направление')
      .max(MAX, `Не больше ${MAX} направлений`)
      .test('learning-selection', learningSelection),
  })
}

/** Схема для вывода типов; форма передаёт в `createProfileStepSchema` загруженные города и категории. */
export const profileStepSchema = createProfileStepSchema()
export type ProfileStepValues = yup.InferType<typeof profileStepSchema>
