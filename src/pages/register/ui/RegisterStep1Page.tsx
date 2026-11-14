import { useNavigate } from 'react-router-dom'

import { OAuthButtons } from '@/features/auth-oauth'
import {
  draftUpdated,
  selectRegisterDraft,
  stepCompleted,
  StepCredentials,
} from '@/features/register'
import { ROUTES } from '@/shared/config'
import { useAppDispatch, useAppSelector } from '@/shared/lib/store'

/**
 * Шаг 1: email и пароль — маршрут `/register/step-1`. Форма — `StepCredentials` из features/register.
 * @see Figma: «Регистрация 1 шаг» (1:2548)
 */
export function RegisterStep1Page() {
  const navigate = useNavigate()
  const draft = useAppSelector(selectRegisterDraft)
  const dispatch = useAppDispatch()

  return (
    <>
      <OAuthButtons />
      <StepCredentials
        defaultValues={{ email: draft.email, password: draft.password }}
        onNext={(values) => {
          dispatch(draftUpdated(values))
          dispatch(stepCompleted(1))
          navigate(ROUTES.REGISTER_STEP_2)
        }}
      />
    </>
  )
}
