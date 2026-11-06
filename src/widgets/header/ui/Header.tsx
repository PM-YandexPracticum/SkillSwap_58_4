import { useState, type ReactNode } from 'react'
import { Link, NavLink, useNavigate } from 'react-router-dom'

import { SearchInput } from '@/features/skill-search'
import ChevronDownIcon from '@/shared/assets/icons/chevron-down.svg?react'
import LikeIcon from '@/shared/assets/icons/like.svg?react'
import LikeFilledIcon from '@/shared/assets/icons/like-filled.svg?react'
import MoonIcon from '@/shared/assets/icons/moon.svg?react'
import NotificationIcon from '@/shared/assets/icons/notification.svg?react'
import { ROUTES } from '@/shared/config'
import { Avatar } from '@/shared/ui/Avatar'
import { Button } from '@/shared/ui/Button'
import { Dropdown } from '@/shared/ui/Dropdown'
import { IconButton } from '@/shared/ui/IconButton'
import { Logo } from '@/shared/ui/Logo'
import styles from './Header.module.css'

type OpenMenu = 'categories' | 'notifications' | 'user'

export interface HeaderProps {
  /** Вошёл ли пользователь. Пока вид переключаем пропом; по сессии его будет выбирать P5-09 */
  isAuth?: boolean
  /** Имя рядом с аватаром (только для вошедшего) */
  userName?: string
  /** Фото пользователя; `null` — заглушка */
  userAvatar?: string | null
  /** Есть ли непрочитанные уведомления — красная точка на колокольчике */
  hasUnread?: boolean
  /** Меню «Все навыки ▾» — `CategoriesMenu` из `widgets/categories-menu`, передаёт `MainLayout` (виджет не импортирует виджет) */
  categoriesMenu?: ReactNode
  /** Окно колокольчика — `NotificationsPanel` из `widgets/notifications-panel`, передаёт `MainLayout` (P7-05) */
  notifications?: ReactNode
  /** Нажали «Выйти» в меню пользователя */
  onLogout?: () => void
  /** Дополнительный CSS-класс */
  className?: string
}

/**
 * Шапка сайта в двух видах (проп `isAuth`).
 * Гость: Logo, «О проекте», «Все навыки ▾» (слот `categoriesMenu`), SearchInput, иконка темы (пока без действия — фаза 9),
 * «Войти», «Зарегистрироваться».
 * Вошедший: вместо кнопок — колокольчик с точкой непрочитанных (слот `notifications`), сердечко → `/favorites`
 * (на странице избранного сердечко подсвечено), имя + аватар → меню «Личный кабинет» / «Выйти».
 * Открыто может быть одно меню из трёх: «Все навыки», уведомления, меню пользователя.
 * @see Figma: 1:2861 (гость), 1:2996 (вошедший), точка на колокольчике — 1:1919
 */
export function Header({
  isAuth = false,
  userName = '',
  userAvatar = null,
  hasUnread = false,
  categoriesMenu,
  notifications,
  onLogout,
  className,
}: HeaderProps) {
  const navigate = useNavigate()
  const [openMenu, setOpenMenu] = useState<OpenMenu | null>(null)

  const toggle = (menu: OpenMenu) => setOpenMenu((current) => (current === menu ? null : menu))
  const closer = (menu: OpenMenu) => () =>
    setOpenMenu((current) => (current === menu ? null : current))

  return (
    <header className={[styles.header, className].filter(Boolean).join(' ')}>
      <Logo />

      <nav className={styles.nav} aria-label="Основная навигация">
        <Link className={styles.link} to={ROUTES.ABOUT}>
          О проекте
        </Link>
        <Dropdown
          isOpen={openMenu === 'categories' && Boolean(categoriesMenu)}
          onClose={closer('categories')}
          trigger={
            <button
              className={`${styles.link} ${styles.categories}`}
              type="button"
              aria-expanded={openMenu === 'categories'}
              onClick={() => toggle('categories')}
            >
              Все навыки
              <ChevronDownIcon
                className={`${styles.icon} ${openMenu === 'categories' ? styles.flipped : ''}`}
                aria-hidden="true"
              />
            </button>
          }
        >
          {categoriesMenu}
        </Dropdown>
      </nav>

      <div className={styles.search}>
        <SearchInput />
      </div>

      <div className={styles.actions}>
        <IconButton ariaLabel="Сменить тему" icon={<MoonIcon className={styles.icon} />} />

        {isAuth ? (
          <>
            <Dropdown
              align="end"
              isOpen={openMenu === 'notifications' && Boolean(notifications)}
              onClose={closer('notifications')}
              trigger={
                <span className={styles.bell}>
                  <IconButton
                    ariaLabel={hasUnread ? 'Уведомления, есть новые' : 'Уведомления'}
                    icon={<NotificationIcon className={styles.icon} />}
                    onClick={() => toggle('notifications')}
                  />
                  {hasUnread && <span className={styles.dot} aria-hidden="true" />}
                </span>
              }
            >
              {notifications}
            </Dropdown>

            <NavLink className={styles.iconLink} to={ROUTES.FAVORITES} aria-label="Избранное">
              {({ isActive }) =>
                isActive ? (
                  <LikeFilledIcon className={styles.icon} />
                ) : (
                  <LikeIcon className={styles.icon} />
                )
              }
            </NavLink>

            <Dropdown
              align="end"
              isOpen={openMenu === 'user'}
              onClose={closer('user')}
              trigger={
                <button
                  className={styles.user}
                  type="button"
                  aria-haspopup="menu"
                  aria-expanded={openMenu === 'user'}
                  onClick={() => toggle('user')}
                >
                  {userName}
                  <Avatar src={userAvatar} alt="" size="sm" />
                </button>
              }
            >
              <ul className={styles.menu}>
                <li>
                  <Link
                    className={styles.menuItem}
                    to={ROUTES.PROFILE}
                    onClick={() => setOpenMenu(null)}
                  >
                    Личный кабинет
                  </Link>
                </li>
                <li>
                  <button
                    className={styles.menuItem}
                    type="button"
                    onClick={() => {
                      setOpenMenu(null)
                      onLogout?.()
                    }}
                  >
                    Выйти
                  </button>
                </li>
              </ul>
            </Dropdown>
          </>
        ) : (
          <div className={styles.buttons}>
            <Button variant="secondary" onClick={() => navigate(ROUTES.LOGIN)}>
              Войти
            </Button>
            <Button onClick={() => navigate(ROUTES.REGISTER)}>Зарегистрироваться</Button>
          </div>
        )}
      </div>
    </header>
  )
}
