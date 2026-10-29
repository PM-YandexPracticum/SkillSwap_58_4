import type { ReactNode } from 'react'

interface RegisterStepGuardProps {
  /** Какой это шаг: 2 или 3 */
  step: 2 | 3
  children: ReactNode
}

/**
 * Не пускает на шаг 2 или 3 регистрации по прямой ссылке: попасть туда можно только кнопками «Далее» / «Продолжить».
 * Если предыдущий шаг не пройден (`selectCompletedStep` < step − 1) — перенаправляет на `/register/step-1`.
 */
export function RegisterStepGuard({ children }: RegisterStepGuardProps) {
  // TODO: useAppSelector(selectCompletedStep) → <Navigate to={ROUTES.REGISTER_STEP_1} replace />
  return <>{children}</>
}
