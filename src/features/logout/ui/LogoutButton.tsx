import { flushSync } from 'react-dom'
import { useNavigate } from 'react-router-dom'
import { endSession } from '@/entities/session'
import { ROUTES } from '@/shared/config'
import { useAppDispatch } from '@/shared/lib/store'

export interface LogoutButtonProps {
  /** Дополнительный CSS-класс */
  className?: string
}

/**
 * Пункт «Выйти» в меню пользователя: `dispatch(endSession())` из `@/entities/session` (стирает сессию в store и localStorage) + переход на главную.
 */
export function LogoutButton({ className }: LogoutButtonProps) {
  const dispatch = useAppDispatch()
  const navigate = useNavigate()

  return (
    <button
      className={className}
      type="button"
      onClick={() => {
        // Завершаем синхронное обновление guard перед окончательным переходом на главную.
        flushSync(() => dispatch(endSession()))
        navigate(ROUTES.HOME, { replace: true })
      }}
    >
      Выйти
    </button>
  )
}
