import { useForm } from 'react-hook-form'
import { Link } from 'react-router-dom'

import { ROUTES, VALIDATION } from '@/shared/config'
import { CredentialsForm } from '@/shared/ui/CredentialsForm'
import type { RegisterDraft } from '../model/types'

export type CredentialsValues = Pick<RegisterDraft, 'email' | 'password'>

export interface StepCredentialsProps {
  /** Отдаёт значения формы. Валидацию и сохранение черновика подключает P6-02 */
  onNext: (values: CredentialsValues) => void
  /** Ошибка под email, например состояние 1:2627 */
  emailError?: string
}

/**
 * Поля первого шага с подсказкой пароля и переходом к входу. OAuth подключает страница.
 * Здесь только вёрстка: формат, уникальность email и сохранение относятся к P6-02.
 * @see Figma: «Регистрация 1 шаг» 1:2548, ошибка email 1:2627
 */
export function StepCredentials({ onNext, emailError }: StepCredentialsProps) {
  const { register, handleSubmit } = useForm<CredentialsValues>({
    defaultValues: { email: '', password: '' },
  })

  return (
    <CredentialsForm
      label="Учётные данные"
      submitLabel="Далее"
      onSubmit={handleSubmit((values) => onNext(values))}
      emailInput={{ ...register('email'), error: emailError }}
      passwordInput={{
        ...register('password'),
        placeholder: 'Придумайте надёжный пароль',
        autoComplete: 'new-password',
        hint: `Пароль должен содержать не менее ${VALIDATION.PASSWORD.MIN} знаков`,
      }}
    >
      Уже есть аккаунт? <Link to={ROUTES.LOGIN}>Войти</Link>
    </CredentialsForm>
  )
}
