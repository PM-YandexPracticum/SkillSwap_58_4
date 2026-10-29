import * as yup from 'yup'

/** Схема формы навыка (шаг 3 регистрации и раздел «Мои навыки») */
export const skillSchema = yup.object({
  title: yup.string().trim().required('Введите название навыка'),
  categoryId: yup.string().required('Выберите категорию'),
  subcategoryId: yup.string().required('Выберите подкатегорию'),
  description: yup.string().trim().required('Опишите навык'),
})

export type SkillFormValues = yup.InferType<typeof skillSchema>
