import { useNavigate } from 'react-router-dom'

import { OAuthButtons } from '@/features/auth-oauth'
import { StepCredentials } from '@/features/register'
import { ROUTES } from '@/shared/config'

/**
 * Шаг 1: email и пароль — маршрут `/register/step-1`. Форма — `StepCredentials` из features/register.
 * @see Figma: «Регистрация 1 шаг» (1:2548)
 */
export function RegisterStep1Page() {
  const navigate = useNavigate()

  return (
    <>
      <OAuthButtons />
      <StepCredentials onNext={() => navigate(ROUTES.REGISTER_STEP_2)} />
    </>
  )
}
