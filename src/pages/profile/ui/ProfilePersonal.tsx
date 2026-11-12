import { ProfileForm } from '@/features/profile-edit';
import { Avatar } from '@/shared/ui/Avatar';
import { useAppSelector } from '@/shared/lib/store';
import { selectUserById } from '@/entities/user';
import { selectSession } from '@/entities/session';
// Иконка редактирования (проверь точное название в assets/icons)
import GalleryEditIcon from '@/shared/assets/icons/gallery-edit.svg?react';
import styles from './ProfilePersonal.module.css';

/**
 * Вёрстка «Личных данных»: ProfileForm и Avatar пользователя из store.
 * Форма пока редактирует демонстрационные значения локально.
 * Сохранение, смену пароля и обработку аватара подключает P7-06.
 * @see Figma: «Профиль_личные данные» (1:2370)
 */
export function ProfilePersonal() {
  const session = useAppSelector(selectSession);
  const user = useAppSelector((state) =>
    session?.userId ? selectUserById(state, session.userId) : null
  );

  if (!user) return null;

  return (
    <section className={styles.personal}>
      {/* Левая часть: Форма */}
      <div className={styles.formWrapper}>
        <ProfileForm />
      </div>

      {/* Правая часть: Аватар с кнопкой редактирования */}
      <div className={styles.avatarWrapper}>
        <Avatar
          src={user.avatarUrl}
          alt={user.name}
          size="lg"
        />
        <button
          type="button"
          className={styles.editAvatar}
          aria-label="Изменить аватар"
        >
          <GalleryEditIcon />
        </button>
      </div>
    </section>
  );
}
