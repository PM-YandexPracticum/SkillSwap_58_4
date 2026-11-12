import { Avatar } from '@/shared/ui/Avatar'
import { IconButton } from '@/shared/ui/IconButton'
import AddIcon from '@/shared/assets/icons/add.svg?react'
import UserCircleIcon from '@/shared/assets/icons/user-circle.svg?react'
import styles from './AvatarUpload.module.css'
export interface AvatarUploadProps {
  /** Текущий путь к фото (`/images/avatars/u17.jpg`) или превью `blob:` */
  value: string | null
  /** Обработку выбора файла подключит P6-04. */
  onChange: (file: File) => void
  /** Текст ошибки (неверный тип или размер файла) */
  error?: string
}

/**
 * Вёрстка аватара второго шага: блок 72 px, внутри user-circle и кнопка «+» 16 px.
 * Фото получает через value; путь обрабатывает общий Avatar.
 * TODO(P6-04): подключить выбор, validateImageFile и fileToDataUrl, отобразить error.
 * В кабинете Avatar и кнопка изменения свёрстаны в P3-14; обработка файла — P7-06.
 * @see Figma: «Регистрация 2 шаг» (1:1497, блок `Icon+Add`).
 */
export function AvatarUpload(props: AvatarUploadProps) {
  return (
    <div className={styles.container}>
      <div className={styles.avatarWrapper}>
        {props.value ? (
          <Avatar src={props.value} alt="Аватар пользователя" className={styles.photo} />
        ) : (
          <UserCircleIcon className={styles.userIcon} aria-hidden="true" />
        )}

        <IconButton
          ariaLabel="Добавить фото"
          icon={<AddIcon aria-hidden="true" />}
          className={styles.addButton}
        />
      </div>
    </div>
  )
}
