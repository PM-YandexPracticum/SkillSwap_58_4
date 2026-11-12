import { NavLink } from 'react-router-dom';
// Используем реальные иконки из вашей папки assets
import RequestIcon from '@/shared/assets/icons/request.svg?react';
import ExchangeIcon from '@/shared/assets/icons/message-text.svg?react';
import LikeIcon from '@/shared/assets/icons/like.svg?react';
import IdeaIcon from '@/shared/assets/icons/idea.svg?react';
import UserIcon from '@/shared/assets/icons/user.svg?react';
import styles from './ProfileSidebar.module.css';

export interface ProfileSidebarProps {
  /** Дополнительный CSS-класс */
  className?: string;
}

const MENU_ITEMS = [
  { to: '/profile/requests', label: 'Заявки', icon: RequestIcon },
  { to: '/profile/exchanges', label: 'Мои обмены', icon: ExchangeIcon },
  { to: '/profile/favorites', label: 'Избранное', icon: LikeIcon },
  { to: '/profile/skills', label: 'Мои навыки', icon: IdeaIcon },
  { to: '/profile', label: 'Личные данные', icon: UserIcon },
];

/**
 * Меню личного кабинета: Заявки, Мои обмены, Избранное, Мои навыки, Личные данные (NavLink с активным пунктом).
 * @see Figma: «Профиль_личные данные» (1:2370)
 */
export function ProfileSidebar({ className }: ProfileSidebarProps) {
  return (
    <nav className={[styles.sidebar, className].filter(Boolean).join(' ')}>
      <ul className={styles.list}>
        {MENU_ITEMS.map(({ to, label, icon: Icon }) => (
          <li key={to}>
            <NavLink
              to={to}
              className={({ isActive }) =>
                [styles.link, isActive ? styles.active : ''].filter(Boolean).join(' ')
              }
              end={to === '/profile'}
            >
              <Icon className={styles.icon} aria-hidden="true" />
              <span>{label}</span>
            </NavLink>
          </li>
        ))}
      </ul>
    </nav>
  );
}
