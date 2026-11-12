import type { ReactNode } from 'react'

interface RegisterStepGuardProps {
  /** Какой это шаг: 2 или 3 */
  step: 2 | 3
  children: ReactNode
}

/**
 * Каркас защиты шагов 2 и 3 регистрации; пока возвращает содержимое без проверки.
 * В P6-01 нужно проверить `selectCompletedStep` и перенаправить на `/register/step-1`,
 * если предыдущий шаг не пройден (`selectCompletedStep` < step − 1).
 */
export function RegisterStepGuard({ children }: RegisterStepGuardProps) {
  // TODO: useAppSelector(selectCompletedStep) → <Navigate to={ROUTES.REGISTER_STEP_1} replace />
  return <>{children}</>
}
