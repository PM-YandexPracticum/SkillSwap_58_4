import { Outlet } from 'react-router-dom'

/**
 * Лейаут экранов входа и регистрации: только Logo и кнопка «Закрыть ×», без шапки и подвала.
 * @see Figma: «Вход» (1:2400), «Регистрация 1 шаг» (1:2548)
 */
export function AuthLayout() {
  // TODO: Logo + кнопка «Закрыть» (navigate(-1))
  return <Outlet />
}
