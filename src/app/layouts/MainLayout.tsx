import { Outlet } from 'react-router-dom'
import { Header } from '@/widgets/header'
import { Footer } from '@/widgets/footer'
import styles from './MainLayout.module.css'
/**
 * Основной лейаут: Header + контент страницы + Footer.
 * Используется для каталога, навыка, профиля, избранного, «О проекте».
 */
export function MainLayout() {
  return (
    <div className={styles.layout}>
      <div className={styles.headerWrap}>
        <Header />
      </div>
      <main className={styles.main}>
        <div className={styles.inner}>
          <Outlet />
        </div>
      </main>
      <Footer />
    </div>
  )
}

