import { useEffect, useId, useRef, useState, type ReactNode } from 'react'
import { Link, NavLink, useLocation, useNavigate } from 'react-router-dom'

import { SearchInput } from '@/features/skill-search'
import { LogoutButton } from '@/features/logout'
import { selectIsAuth } from '@/entities/session'
import { selectCurrentUser } from '@/entities/user'
import { selectHasUnread } from '@/entities/notification'
import ChevronDownIcon from '@/shared/assets/icons/chevron-down.svg?react'
import LikeIcon from '@/shared/assets/icons/like.svg?react'
import LikeFilledIcon from '@/shared/assets/icons/like-filled.svg?react'
import { ThemeToggle } from '@/features/theme-toggle'
import NotificationIcon from '@/shared/assets/icons/notification.svg?react'
import { ROUTES } from '@/shared/config'
import { useAppSelector } from '@/shared/lib/store'
import { Avatar } from '@/shared/ui/Avatar'
import { Button } from '@/shared/ui/Button'
import { Dropdown } from '@/shared/ui/Dropdown'
import { IconButton } from '@/shared/ui/IconButton'
import { Logo } from '@/shared/ui/Logo'
import styles from './Header.module.css'

type OpenMenu = 'categories' | 'notifications' | 'user'

export interface HeaderProps {
  /** Меню «Все навыки ▾» — `CategoriesMenu` из `widgets/categories-menu`, передаёт `MainLayout` (виджет не импортирует виджет) */
  categoriesMenu?: ReactNode
  /** Окно колокольчика — `NotificationsPanel` из `widgets/notifications-panel`, передаёт `MainLayout` (P7-05) */
  notifications?: ReactNode
  /** Дополнительный CSS-класс */
  className?: string
}

/**
 * Шапка читает состояние входа и текущего пользователя из Redux.
 * Гость: Logo, «О проекте», «Все навыки ▾» (слот `categoriesMenu`), SearchInput, переключатель темы,
 * «Войти», «Зарегистрироваться».
 * Вошедший: вместо кнопок — колокольчик с точкой непрочитанных (слот `notifications`), сердечко → `/favorites`
 * (на странице избранного сердечко подсвечено), имя + аватар → меню «Личный кабинет» / «Выйти».
 * Открыто может быть одно меню из трёх: «Все навыки», уведомления, меню пользователя.
 * @see Figma: 1:2861 (гость), 1:2996 (вошедший), точка на колокольчике — 1:1919
 */
export function Header({ categoriesMenu, notifications, className }: HeaderProps) {
  const navigate = useNavigate()
  const location = useLocation()
  const isAuth = useAppSelector(selectIsAuth)
  const currentUser = useAppSelector(selectCurrentUser)
  const hasUnread = useAppSelector(selectHasUnread)
  const [openMenu, setOpenMenu] = useState<OpenMenu | null>(null)
  const userMenuId = useId()
  const categoriesMenuId = useId()
  const categoriesTriggerRef = useRef<HTMLButtonElement>(null)
  const userTriggerRef = useRef<HTMLButtonElement>(null)
  const notificationsPanelId = useId()
  const notificationsTriggerRef = useRef<HTMLSpanElement>(null)
  const hasCategoriesMenu = Boolean(categoriesMenu)
  const hasNotifications = Boolean(notifications)
  const isCategoriesOpen = openMenu === 'categories' && hasCategoriesMenu
  const isNotificationsOpen = openMenu === 'notifications' && hasNotifications
  const isUserMenuOpen = openMenu === 'user'

  useEffect(() => {
    setOpenMenu(null)
  }, [isAuth, currentUser?.id, location.key])

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
          className={styles.categoriesPopover}
          isOpen={isCategoriesOpen}
          onClose={closer('categories')}
          trigger={
            <button
              ref={categoriesTriggerRef}
              className={`${styles.link} ${styles.categories}`}
              type="button"
              aria-expanded={isCategoriesOpen}
              aria-controls={isCategoriesOpen ? categoriesMenuId : undefined}
              onClick={() => hasCategoriesMenu && toggle('categories')}
            >
              Все навыки
              <ChevronDownIcon
                className={`${styles.icon} ${openMenu === 'categories' ? styles.flipped : ''}`}
                aria-hidden="true"
              />
            </button>
          }
        >
          <div
            id={categoriesMenuId}
            className={styles.categoriesRegion}
            role="region"
            aria-label="Все навыки"
            tabIndex={0}
            onKeyDown={(event) => {
              if (event.key === 'Escape') categoriesTriggerRef.current?.focus()
            }}
          >
            {categoriesMenu}
          </div>
        </Dropdown>
      </nav>

      <div className={styles.search}>
        <SearchInput />
      </div>

      <div className={styles.actions}>
        <ThemeToggle />

        {isAuth ? (
          <>
            <Dropdown
              className={styles.notificationsPopover}
              align="end"
              isOpen={isNotificationsOpen}
              onClose={closer('notifications')}
              trigger={
                <span className={styles.bell} ref={notificationsTriggerRef}>
                  <IconButton
                    ariaLabel={hasUnread ? 'Уведомления, есть новые' : 'Уведомления'}
                    icon={<NotificationIcon className={styles.icon} />}
                    aria-expanded={isNotificationsOpen}
                    aria-controls={hasNotifications ? notificationsPanelId : undefined}
                    onClick={() => hasNotifications && toggle('notifications')}
                  />
                  {hasUnread && <span className={styles.dot} aria-hidden="true" />}
                </span>
              }
            >
              <div
                id={notificationsPanelId}
                role="region"
                aria-label="Уведомления"
                tabIndex={0}
                onKeyDown={(event) => {
                  if (event.key === 'Escape')
                    notificationsTriggerRef.current?.querySelector('button')?.focus()
                }}
              >
                {notifications}
              </div>
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
                  ref={userTriggerRef}
                  className={styles.user}
                  type="button"
                  aria-label={currentUser?.name ? undefined : 'Меню пользователя'}
                  aria-expanded={isUserMenuOpen}
                  aria-controls={isUserMenuOpen ? userMenuId : undefined}
                  onClick={() => toggle('user')}
                >
                  <span className={styles.userName} title={currentUser?.name}>
                    {currentUser?.name}
                  </span>
                  <Avatar src={currentUser?.avatarUrl ?? null} alt="" size="sm" />
                </button>
              }
            >
              <ul
                id={userMenuId}
                className={styles.menu}
                onKeyDown={(event) => {
                  if (event.key === 'Escape') userTriggerRef.current?.focus()
                }}
              >
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
                  <LogoutButton className={styles.menuItem} />
                </li>
              </ul>
            </Dropdown>
          </>
        ) : (
          <div className={styles.buttons}>
            <Button variant="secondary" onClick={() => navigate(ROUTES.LOGIN)}>
              Войти
            </Button>
            <Button onClick={() => navigate(ROUTES.REGISTER_STEP_1)}>Зарегистрироваться</Button>
          </div>
        )}
      </div>
    </header>
  )
}
