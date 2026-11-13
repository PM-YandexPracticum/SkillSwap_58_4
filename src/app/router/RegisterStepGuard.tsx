import type { ReactNode } from 'react'
import { Navigate } from 'react-router-dom'

import { selectCompletedStep } from '@/features/register'
import { ROUTES } from '@/shared/config'
import { useAppSelector } from '@/shared/lib/store'

export interface RegisterStepGuardProps {
  /** Какой это шаг: 2 или 3 */
  step: 2 | 3
  children: ReactNode
}

/**
 * Защита шагов 2 и 3 регистрации: попасть туда можно только кнопками «Далее» / «Продолжить».
 * Если предыдущий шаг не пройден (`selectCompletedStep` < step − 1) — перенаправляет на `/register/step-1`
 * с `replace`, чтобы «Назад» браузера не возвращал на закрытый шаг. Пройденные шаги открываются свободно,
 * поэтому «Назад» на шаг 2 из шага 3 работает. Состояние не сохраняется между перезагрузками:
 * без черновика прямой вход на шаг 2 или 3 всегда ведёт на шаг 1.
 */
export function RegisterStepGuard({ step, children }: RegisterStepGuardProps) {
  const completedStep = useAppSelector(selectCompletedStep)

  if (completedStep < step - 1) {
    return <Navigate to={ROUTES.REGISTER_STEP_1} replace />
  }

  return <>{children}</>
}
