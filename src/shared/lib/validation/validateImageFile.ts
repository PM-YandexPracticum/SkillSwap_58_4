import { VALIDATION } from '../../config/validation'

/**
 * Проверяет картинку перед загрузкой: тип (jpg, png, webp) и размер (до 1 МБ) из `VALIDATION.IMAGE`.
 * Тексты ошибок совпадают с `docs/rules/validation.md` и yup-схемами форм —
 * чтобы форма показывала одинаковый текст.
 * Вызывается до `fileToDataUrl`: чтение и сжатие файл уже не проверяют.
 *
 * @param file - файл, выбранный пользователем или перетащенный в dropzone
 * @returns текст ошибки для пользователя или `null`, если файл подходит
 */
export function validateImageFile(file: File): string | null {
  // `as const` сузил TYPES до литералов — приводим к массиву строк, чтобы includes принял file.type
  const allowedTypes: readonly string[] = VALIDATION.IMAGE.TYPES

  if (!allowedTypes.includes(file.type)) {
    return 'Только JPG, PNG или WEBP'
  }

  if (file.size > VALIDATION.IMAGE.MAX_SIZE_BYTES) {
    return 'Файл больше 1 МБ'
  }

  return null
}
