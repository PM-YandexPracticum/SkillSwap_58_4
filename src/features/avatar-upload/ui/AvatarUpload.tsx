import { useId, useRef, useState, type ChangeEvent } from 'react'

import AddIcon from '@/shared/assets/icons/add.svg?react'
import UserCircleIcon from '@/shared/assets/icons/user-circle.svg?react'
import { VALIDATION } from '@/shared/config'
import { fileToDataUrl } from '@/shared/lib/image'
import { validateImageFile } from '@/shared/lib/validation'
import { Avatar } from '@/shared/ui/Avatar'
import { IconButton } from '@/shared/ui/IconButton'

import styles from './AvatarUpload.module.css'

const ACCEPT = VALIDATION.IMAGE.TYPES.join(',')
/** Текст ошибки чтения файла: в validation.md его нет, проверка типа и размера отдельная */
const READ_ERROR = 'Не удалось загрузить фото. Попробуйте другой файл'

export interface AvatarUploadProps {
  /** Текущее фото: путь (`/images/avatars/u17.jpg`) или data URL */
  value: string | null
  /**
   * Выбранный файл прошёл `validateImageFile` и уменьшен `fileToDataUrl` до 800 px.
   * Отдаёт готовый data URL: повторно сжимать его не нужно, `File` наружу не выходит.
   */
  onChange: (dataUrl: string) => void
  /** Внешняя ошибка поля. Ошибка выбранного файла показывается вместо неё. */
  error?: string
  disabled?: boolean
}

/**
 * Аватар второго шага регистрации: блок 72 px, внутри user-circle или фото и кнопка «+» 16 px.
 * Кнопка открывает выбор файла (jpg, png, webp до 1 МБ). Файл проверяет `validateImageFile`:
 * тексты ошибок «Только JPG, PNG или WEBP» / «Файл больше 1 МБ» показываются под аватаром.
 * Подходящий файл читает `fileToDataUrl`, пока идёт чтение, кнопка недоступна.
 * Компонент не знает про черновик: фото сохраняет тот, кто его использует (регистрация — P6-04,
 * личные данные в кабинете — P7-06).
 * @see Figma: «Регистрация 2 шаг» (1:1497, блок `Icon+Add`).
 */
export function AvatarUpload({ value, onChange, error, disabled = false }: AvatarUploadProps) {
  const inputRef = useRef<HTMLInputElement>(null)
  const errorId = useId()
  const [fileError, setFileError] = useState<string>()
  const [isLoading, setIsLoading] = useState(false)
  const shownError = fileError ?? error

  const handleChange = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    // Сбрасываем выбор: тот же файл можно выбрать повторно, и событие сработает снова
    event.target.value = ''
    if (!file) return

    const validationError = validateImageFile(file)
    if (validationError) {
      setFileError(validationError)
      return
    }

    setFileError(undefined)
    setIsLoading(true)
    try {
      onChange(await fileToDataUrl(file))
    } catch {
      setFileError(READ_ERROR)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className={styles.root}>
      <div className={styles.container}>
        <div className={styles.avatarWrapper}>
          {value ? (
            <Avatar src={value} alt="Аватар пользователя" className={styles.photo} />
          ) : (
            <UserCircleIcon className={styles.userIcon} aria-hidden="true" />
          )}

          <IconButton
            ariaLabel={value ? 'Изменить фото' : 'Добавить фото'}
            icon={<AddIcon aria-hidden="true" />}
            className={styles.addButton}
            disabled={disabled || isLoading}
            aria-busy={isLoading}
            aria-describedby={shownError ? errorId : undefined}
            onClick={() => inputRef.current?.click()}
          />
        </div>
      </div>
      <input
        ref={inputRef}
        type="file"
        hidden
        accept={ACCEPT}
        data-testid="avatar-upload-input"
        onChange={(event) => void handleChange(event)}
      />
      {shownError && (
        <p id={errorId} className={styles.error} role="alert">
          {shownError}
        </p>
      )}
    </div>
  )
}
