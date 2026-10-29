import { Outlet } from 'react-router-dom'

/**
 * Личный кабинет `/profile/*`: ProfileSidebar слева, справа — вложенный раздел через <Outlet />.
 * @see Figma: «Профиль_личные данные» (1:2370)
 */
export function ProfilePage() {
  // TODO: добавить ProfileSidebar и сетку по макету
  return (
    <main>
      <h1>ProfilePage</h1>
      <Outlet />
    </main>
  )
}
