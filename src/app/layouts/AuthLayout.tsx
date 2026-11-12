import { Outlet, useNavigate } from 'react-router-dom'

import { registerReset } from '@/features/register'
import CrossIcon from '@/shared/assets/icons/cross.svg?react'
import { useAppDispatch } from '@/shared/lib/store'
import { Button } from '@/shared/ui/Button'
import { Logo } from '@/shared/ui/Logo'
import styles from './AuthLayout.module.css'

/**
 * Лейаут экранов входа и регистрации: только Logo и кнопка «Закрыть ×», без шапки и подвала.
 * Закрытие возвращает на предыдущую запись истории и сбрасывает черновик регистрации (на входе он пуст,
 * поэтому поведение закрытия входа не меняется); основную область main предоставляет страница.
 * @see Figma: «Вход» (1:2400), «Регистрация 1 шаг» (1:2548)
 */
export function AuthLayout() {
  const navigate = useNavigate()
  const dispatch = useAppDispatch()

  const handleClose = () => {
    dispatch(registerReset())
    navigate(-1)
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
