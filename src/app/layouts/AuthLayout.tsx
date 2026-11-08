import { useNavigate } from 'react-router-dom'
import { Outlet } from 'react-router-dom'
import { Logo } from '@/shared/ui/Logo'
import { Button } from '@/shared/ui/Button'
import Cross from '../../shared/assets/icons/cross.svg?react'
import styles from './AuthLayout.module.css'
/**
 * Лейаут экранов входа и регистрации: только Logo и кнопка «Закрыть ×», без шапки и подвала.
 * @see Figma: «Вход» (1:2400), «Регистрация 1 шаг» (1:2548)
 */

export function AuthLayout() {
  const navigate = useNavigate()
  return (
    <div className={styles.layout}>
      <header className={styles.header}>
        <Logo />
        <Button variant="ghost" onClick={() => navigate(-1)}>
  <span className={styles.closeInner}>
    Закрыть
    <Cross className={styles.crossIcon} aria-hidden />
  </span>
        </Button>
      </header>
      <main className={styles.main}>
        <Outlet />
      </main>
    </div>
  )
}
