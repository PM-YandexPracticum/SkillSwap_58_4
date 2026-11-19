import { useState } from 'react'

import { ProfileForm } from '@/features/profile-edit'
import { AvatarUpload } from '@/features/avatar-upload'

import { useAppSelector } from '@/shared/lib/store'
import { selectCurrentUser } from '@/entities/user'

import styles from './ProfilePersonal.module.css'

/**
 * Личные данные пользователя.
 *
 * P7-06:
 * - отображение данных пользователя;
 * - редактирование аватара;
 * - временное хранение выбранного фото;
 * - совместное сохранение профиля и аватара.
 *
 * @see Figma: «Профиль_личные данные» (1:2370)
 */
export function ProfilePersonal() {
  const user = useAppSelector(selectCurrentUser)

  // Временное фото до нажатия кнопки сохранить
  const [avatarDraft, setAvatarDraft] = useState<string | null>(null)

  // Состояние обработки изображения
  const [isAvatarProcessing, setIsAvatarProcessing] = useState(false)

  if (!user) return null

  return (
    <section className={styles.personal}>
      {/* Левая часть: форма личных данных */}
      <div className={styles.formWrapper}>
        <ProfileForm
          // Выбранный аватар тоже считается изменением формы
          extraDirty={Boolean(avatarDraft)}
          // Запрещаем сохранение во время обработки фотографии
          submitBlocked={isAvatarProcessing}
          // Передаём аватар в общую операцию сохранения
          onBeforeSubmit={() => ({
            ...(avatarDraft !== null ? { avatarUrl: avatarDraft } : {}),
          })}
          // Очищаем временный аватар только после успешного сохранения
          onSaved={() => {
            setAvatarDraft(null)
          }}
        />
      </div>

      {/* Правая часть: загрузка аватара */}
      <div className={styles.avatarWrapper}>
        <AvatarUpload
          // Показываем новое фото или сохранённый аватар пользователя
          value={avatarDraft ?? user.avatarUrl ?? null}
          // Получаем обработанный data URL
          onChange={(dataUrl) => {
            setAvatarDraft(dataUrl)
          }}
          alt={user.name}
          // Получаем состояние обработки файла
          onProcessingChange={setIsAvatarProcessing}
          // Блокируем загрузчик во время обработки
          disabled={isAvatarProcessing}
        />
      </div>
    </section>
  )
}
