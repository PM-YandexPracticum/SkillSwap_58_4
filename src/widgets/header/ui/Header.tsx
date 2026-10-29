export interface HeaderProps {
  /** Дополнительный CSS-класс */
  className?: string
}

/**
 * Шапка сайта.
 * Гость: Logo, «О проекте», «Все навыки ▾» (CategoriesMenu), SearchInput, иконка темы (необязательная фича, фаза 9),
 * «Войти», «Зарегистрироваться».
 * Вошедший: вместо кнопок — колокольчик с точкой непрочитанных (NotificationsPanel), сердечко → `/favorites`
 * (на странице избранного сердечко подсвечено), имя + аватар → меню «Личный кабинет» / «Выйти».
 * @see Figma: 1:2861 (гость), 1:2996 (вошедший)
 */
export function Header(_props: HeaderProps) {
  // TODO: реализовать по макету
  return null
}
