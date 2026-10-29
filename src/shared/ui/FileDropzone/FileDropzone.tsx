export interface FileDropzoneProps {
  /** Подпись внутри зоны, по макету — «Перетащите или выберите изображения навыка» */
  hint: string
  /** Текст кнопки-ссылки, по макету — «Выбрать изображения» */
  buttonLabel: string
  /** MIME-типы для `<input accept>`, по умолчанию — из `VALIDATION.IMAGE.TYPES` */
  accept?: readonly string[]
  /** Можно ли выбрать несколько файлов */
  multiple?: boolean
  /** Выбранные или перетащенные файлы. Проверка — у родителя (`validateImageFile`) */
  onFiles: (files: File[]) => void
  /** Превью уже выбранных файлов (`blob:`) с крестиком удаления */
  previews?: ReadonlyArray<{ url: string; onRemove: () => void }>
  error?: string
  disabled?: boolean
}

/**
 * Зона загрузки файлов: пунктирная рамка, перетаскивание (drag & drop) или выбор через скрытый `<input type="file">`.
 * Во время перетаскивания рамка подсвечивается. Доступна с клавиатуры: Enter / Space открывают выбор файла.
 * @see Figma: «Регистрация 3 шаг» — блок под «Описание»
 */
export function FileDropzone(_props: FileDropzoneProps) {
  // TODO: onDragOver / onDrop + input[type=file]
  return null
}
