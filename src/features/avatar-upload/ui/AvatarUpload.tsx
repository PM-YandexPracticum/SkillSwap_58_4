export interface AvatarUploadProps {
  /** Текущий путь к фото (`/images/avatars/u17.jpg`) или превью `blob:` */
  value: string | null
  /** Новый файл прошёл проверку — родитель превращает его в data URL (`fileToDataUrl`) и сохраняет по «Сохранить» / «Готово» */
  onChange: (file: File) => void
  /** Текст ошибки (неверный тип или размер файла) */
  error?: string
}

/**
 * Большой круглый аватар с кнопкой-иконкой смены фото.
 * Файл проверяется `validateImageFile` (jpg/png/webp, до 1 МБ), превью — через `URL.createObjectURL`,
 * картинка — через `resolveImageUrl`.
 * @see Figma: «Профиль_личные данные» (1:2370)
 */
export function AvatarUpload(_props: AvatarUploadProps) {
  // TODO: реализовать по макету
  return null
}
