import { Outlet } from 'react-router-dom';
import { ProfileSidebar } from '@/widgets/profile-sidebar';
import styles from './ProfilePage.module.css';

/**
 * Личный кабинет `/profile/*`: ProfileSidebar слева, справа — вложенный раздел через <Outlet />.
 * @see Figma: «Профиль_личные данные» (1:2370)
 */
export function ProfilePage() {
  return (
    <main className={styles.page}>
      <div className={styles.container}>
        {/* Левая колонка: Сайдбар */}
        <aside className={styles.sidebar}>
          <ProfileSidebar />
        </aside>

        {/* Правая колонка: Сюда будет подставляться ProfilePersonal (или другие разделы) */}
        <div className={styles.content}>
          <Outlet />
        </div>
      </div>
    </main>
  );
}
