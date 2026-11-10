import { Avatar } from '@/shared/ui/Avatar'
import { IconButton } from '@/shared/ui/IconButton'
import AddIcon from '@/shared/assets/icons/add.svg?react'
import UserCircleIcon from '@/shared/assets/icons/user-circle.svg?react'
import styles from './AvatarUpload.module.css'
export interface AvatarUploadProps {
  /** Текущий путь к фото (`/images/avatars/u17.jpg`) или превью `blob:` */
  value: string | null
  /** Новый файл прошёл проверку — родитель превращает его в data URL (`fileToDataUrl`) и сохраняет по «Сохранить» / «Готово» */
  onChange: (file: File) => void
  /** Текст ошибки (неверный тип или размер файла) */
  error?: string
}

/**
 * Аватар с выбором фото. В макете два вида:
 * - шаг 2 регистрации — фото ещё нет: иконка `user-circle` 72 px и маленький «+» (`add`, 16 px) в правом нижнем углу;
 * - «Личные данные» — фото-круг 244 px и круглая кнопка 56 px в углу: фон `--color-accent-soft`, иконка `gallery-edit`.
 * Это не `FileDropzone`: общие с ним только `validateImageFile` (jpg/png/webp, до 1 МБ) и `fileToDataUrl`.
 * Превью — через `URL.createObjectURL`, картинка — через `resolveImageUrl`.
 * @see Figma: «Регистрация 2 шаг» (1:1497, блок `Icon+Add`), «Профиль_личные данные» (1:2370, блок `User photo`)
 */
export function AvatarUpload(props: AvatarUploadProps) {
  return (
    <div className={styles.container}>
      <div className={styles.avatarWrapper}>
        {props.value ? (
          <Avatar src={props.value} alt="Аватар пользователя" />
        ) : (
          <UserCircleIcon className={styles.userIcon} />
        )}

        <IconButton ariaLabel="Добавить фото" icon={<AddIcon />} className={styles.addButton} />
      </div>
    </div>
  )
}
