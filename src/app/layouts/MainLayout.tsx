import { Outlet } from 'react-router-dom'

import { Footer } from '@/widgets/footer'
import { Header } from '@/widgets/header'
import styles from './MainLayout.module.css'

/**
 * Основной лейаут: Header + контент страницы + Footer.
 * Используется для каталога, навыка, профиля, избранного, «О проекте».
 * Ширину контента задаёт лейаут; основную область main предоставляет страница.
 * @see Figma: «Каталог — пользователь не авторизован» (1:2861)
 */
export function MainLayout() {
  return (
    <div className={styles.layout}>
      <div className={styles.headerWrap}>
        <Header />
      </div>
      <div className={styles.content}>
        <Outlet />
      </div>
      <Footer />
    </div>
  )
}
