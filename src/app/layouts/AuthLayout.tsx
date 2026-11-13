import { Outlet, useMatch, useNavigate } from 'react-router-dom'

import CrossIcon from '@/shared/assets/icons/cross.svg?react'
import { ROUTES } from '@/shared/config'
import { Button } from '@/shared/ui/Button'
import { Logo } from '@/shared/ui/Logo'
import styles from './AuthLayout.module.css'

/**
 * Лейаут экранов входа и регистрации: только Logo и кнопка «Закрыть ×», без шапки и подвала.
 * Закрытие регистрации ведёт на главную с replace; закрытие входа — на предыдущую запись истории.
 * Черновик при выходе очищает RegisterDraftLifecycle. Основную область main предоставляет страница.
 * @see Figma: «Вход» (1:2400), «Регистрация 1 шаг» (1:2548)
 */
export function AuthLayout() {
  const navigate = useNavigate()
  const isRegister = Boolean(useMatch(`${ROUTES.REGISTER}/*`))

  const handleClose = () => {
    if (isRegister) {
      navigate(ROUTES.HOME, { replace: true })
    } else {
      navigate(-1)
    }
  }

  return (
    <div className={styles.layout}>
      <header className={styles.header}>
        <Logo />
        <Button variant="ghost" onClick={handleClose}>
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
