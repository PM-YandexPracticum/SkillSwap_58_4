import { useNavigate } from 'react-router-dom'
import { endSession } from '@/entities/session'
import { ROUTES } from '@/shared/config'
import { useAppDispatch } from '@/shared/lib/store'

export interface LogoutButtonProps {
  /** Дополнительный CSS-класс */
  className?: string
}

/**
 * Завершает сессию сразу по клику и переводит на главную с заменой истории.
 * Очистка не зависит от размонтирования кнопки и загрузки целевой страницы.
 * @see Figma: 1:2323 — меню пользователя.
 */
export function LogoutButton({ className }: LogoutButtonProps) {
  const dispatch = useAppDispatch()
  const navigate = useNavigate()

  return (
    <button
      className={className}
      type="button"
      onClick={() => {
        dispatch(endSession())
        navigate(ROUTES.HOME, { replace: true })
      }}
    >
      Выйти
    </button>
  )
}
