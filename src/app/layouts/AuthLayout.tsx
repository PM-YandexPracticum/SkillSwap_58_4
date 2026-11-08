import { Outlet, useNavigate } from 'react-router-dom'

import CrossIcon from '@/shared/assets/icons/cross.svg?react'
import { Button } from '@/shared/ui/Button'
import { Logo } from '@/shared/ui/Logo'
import styles from './AuthLayout.module.css'

/**
 * Лейаут экранов входа и регистрации: только Logo и кнопка «Закрыть ×», без шапки и подвала.
 * Закрытие возвращает на предыдущую запись истории; основную область main предоставляет страница.
 * @see Figma: «Вход» (1:2400), «Регистрация 1 шаг» (1:2548)
 */
export function AuthLayout() {
  const navigate = useNavigate()

  return (
    <div className={styles.layout}>
      <header className={styles.header}>
        <Logo />
        <Button variant="ghost" onClick={() => navigate(-1)}>
          Закрыть
          <CrossIcon className={styles.crossIcon} aria-hidden="true" />
        </Button>
      </header>
      <div className={styles.content}>
        <Outlet />
      </div>
    </div>
  )
}
