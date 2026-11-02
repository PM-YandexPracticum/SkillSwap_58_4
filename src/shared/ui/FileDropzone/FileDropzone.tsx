import { useRef, useState } from 'react'
import type { MouseEvent, ChangeEvent, DragEvent } from 'react'
import { VALIDATION } from '../../config/validation'
import styles from './FileDropzone.module.css'

/**
 * Иконки gallery-add.svg, cross.svg
 * Импорт по правилам см. [../../assets/icons/README.md]
 */
import GalleryAddIcon from '@/shared/assets/icons/gallery-add.svg?react'
import CrossIcon from '@/shared/assets/icons/cross.svg?react'

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
 * Зона загрузки файлов: drag & drop или выбор через скрытый `<input type="file">`.
 *
 * Поведение:
 * - клик по всей пунктирной зоне открывает диалог выбора файла;
 * - кнопка «Выбрать изображения» дублирует клик и доступна с клавиатуры —
 *   у самой зоны нет `tabIndex`, поэтому по Tab она не останавливается;
 * - пока над зоной тащат файл, рамка подсвечивается акцентным цветом;
 * - превью выбранных файлов и текст ошибки выводятся под зоной.
 *
 * Проверка файлов — у родителя (`validateImageFile`); компонент передаёт `File[]` через `onFiles`.
 *
 * @see Figma: 1:1761 «Регистрация 3 шаг» — блок под «Описание»
 */
export function FileDropzone({
  hint,
  buttonLabel,
  accept = VALIDATION.IMAGE.TYPES,
  multiple,
  onFiles,
  previews,
  error,
  disabled,
}: FileDropzoneProps) {
  /** Счётчик вложенности: dragenter +1, dragleave −1. Пока > 0 — мы внутри зоны */
  const dragDepth = useRef(0)

  /** Флаг «над зоной тащат файл» — переключает класс подсветки рамки */
  const [isDragging, setIsDragging] = useState(false)

  /** Ссылка на скрытый input — клик по зоне программно открывает диалог выбора */
  const inputRef = useRef<HTMLInputElement>(null)

  /** Открывает системный диалог выбора файла. Вызывается из клика по зоне и по кнопке */
  const openFileDialog = () => {
    if (disabled) return
    if (inputRef.current) inputRef.current.click()
  }

  /** Клик по кнопке «Выбрать изображения» */
  const handleButtonClick = (e: MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation() // иначе клик всплывёт до зоны и диалог откроется дважды
    openFileDialog()
  }

  /** Пользователь выбрал файл в диалоге (или закрыл его) */
  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files // берём FileList
    if (!files) return
    if (files.length === 0) return

    const filesArray = [...files] // FileList → File[]
    onFiles(filesArray) // проверка типа и размера — у родителя
    e.target.value = '' // сброс: иначе повторный выбор того же файла не вызовет change
  }

  /** Вход в зону или во вложенный элемент */
  const handleDragEnter = () => {
    if (disabled) return
    dragDepth.current += 1
    setIsDragging(true)
  }

  /** Уход с элемента; гасим, когда покинут последний вложенный элемент */
  const handleDragLeave = () => {
    dragDepth.current = Math.max(0, dragDepth.current - 1) // не уходим в минус
    if (dragDepth.current > 0) return // ещё внутри зоны
    setIsDragging(false)
  }

  /** Над зоной — разрешаем drop и страхуемся, если dragleave потерялся */
  const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault() // иначе браузер откроет файл вместо drop
    if (disabled) return
    if (!isDragging) setIsDragging(true) // страховка от «потерянного» enter
  }

  /** Отпустили — гасим подсветку и отдаём файлы родителю */
  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault() // иначе браузер откроет файл вместо drop
    dragDepth.current = 0 // полный сброс, НЕ «−1»
    setIsDragging(false) // подсветку гасим всегда, до проверки disabled

    if (disabled) return // зона недоступна — файл не принимаем

    const files = e.dataTransfer.files // файлы, отпущенные над зоной
    if (files.length === 0) return // drop без файлов (текст, ссылка) — игнор

    const filesArray = [...files] // FileList → File[]
    onFiles(filesArray) // проверка типа и размера — у родителя
  }

  const zoneClassName = [styles.zone, isDragging && styles.dragging, disabled && styles.disabled]
    .filter(Boolean)
    .join(' ')

  return (
    <div className={styles.dropzone}>
      <div
        className={zoneClassName}
        data-testid="filedropzone-zone"
        onClick={openFileDialog}
        onDragEnter={handleDragEnter}
        onDragLeave={handleDragLeave}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
      >
        <span className={styles.hint}>{hint}</span>
        <button
          type="button"
          className={styles.link}
          data-testid="filedropzone-button"
          onClick={handleButtonClick}
          disabled={disabled}
        >
          <GalleryAddIcon className={styles.linkIcon} />
          {buttonLabel}
        </button>
        <input
          ref={inputRef}
          type="file"
          hidden
          data-testid="filedropzone-input"
          multiple={multiple}
          accept={accept.join(',')}
          onChange={handleInputChange}
          onClick={(e) => e.stopPropagation()} // иначе клик всплывёт до зоны и диалог откроется дважды
          disabled={disabled}
        />
      </div>
      {previews && (
        <div className={styles.previews}>
          {previews.map((preview) => (
            <div key={preview.url} className={styles.preview} data-testid="filedropzone-preview">
              <img src={preview.url} alt="Превью изображения" className={styles.previewImage} />
              <button
                type="button"
                className={styles.previewRemove}
                data-testid="filedropzone-preview-remove"
                disabled={disabled}
                onClick={preview.onRemove}
                aria-label="Удалить изображение"
              >
                <CrossIcon className={styles.previewRemoveIcon} />
              </button>
            </div>
          ))}
        </div>
      )}
      {error && (
        <p className={styles.error} role="alert" data-testid="filedropzone-error">
          {error}
        </p>
      )}
    </div>
  )
}
