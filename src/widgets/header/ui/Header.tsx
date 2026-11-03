import type { ReactNode } from 'react'

export interface HeaderProps {
  /** Меню «Все навыки ▾» — `CategoriesMenu` из `widgets/categories-menu`, передаёт `MainLayout` (виджет не импортирует виджет) */
  categoriesMenu?: ReactNode
  /** Окно колокольчика — `NotificationsPanel` из `widgets/notifications-panel`, передаёт `MainLayout` (P7-05) */
  notifications?: ReactNode
  /** Дополнительный CSS-класс */
  className?: string
}

/**
 * Шапка сайта. Вид выбирает по сессии: `selectIsAuth` — вошёл ли, `selectCurrentUser` — кто именно (P5-09).
 * Гость: Logo, «О проекте», «Все навыки ▾» (слот `categoriesMenu`), SearchInput, иконка темы (необязательная фича, фаза 9),
 * «Войти», «Зарегистрироваться».
 * Вошедший: вместо кнопок — колокольчик с точкой непрочитанных (слот `notifications`), сердечко → `/favorites`
 * (на странице избранного сердечко подсвечено), имя + аватар → меню «Личный кабинет» / «Выйти».
 * @see Figma: 1:2861 (гость), 1:2996 (вошедший)
 */
export function Header(_props: HeaderProps) {
  // TODO: реализовать по макету
  return null
}
