export interface SkillFormProps {
  defaultValues?: Partial<import('../model/schema').SkillFormValues>
  onSubmit: (values: import('../model/schema').SkillFormValues, images: File[]) => void
  onBack?: () => void
}

/**
 * Форма навыка, которому пользователь может научить (всегда ровно один): «Название навыка» — своё, например «Игра на барабанах»;
 * «Категория навыка» и «Подкатегория навыка» — CategorySubcategorySelect в режиме `single`; «Описание»;
 * фото — FileDropzone «Перетащите или выберите изображения навыка» (1–4). «Назад» / «Продолжить».
 * @see Figma: «Регистрация 3 шаг» (1:1761)
 */
export function SkillForm(_props: SkillFormProps) {
  // TODO: react-hook-form + skillSchema
  return null
}
