import * as yup from 'yup'
import { VALIDATION } from '@/shared/config'
import { skillTitleField, textField } from '@/shared/lib/validation'

/** Схема формы навыка (шаг 3 регистрации и раздел «Мои навыки») */
export const skillSchema = yup.object({
  title: skillTitleField(),
  categoryId: yup.string().required('Выберите категорию'),
  subcategoryId: yup.string().required('Выберите подкатегорию'),
  description: textField(
    VALIDATION.SKILL_DESCRIPTION.MIN,
    VALIDATION.SKILL_DESCRIPTION.MAX,
  ).required('Опишите навык'),
})

export type SkillFormValues = yup.InferType<typeof skillSchema>
