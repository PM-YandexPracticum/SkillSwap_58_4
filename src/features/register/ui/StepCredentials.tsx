import { useForm } from 'react-hook-form'
import { Link } from 'react-router-dom'

import { ROUTES, VALIDATION } from '@/shared/config'
import { CredentialsForm } from '@/shared/ui/CredentialsForm'
import type { RegisterDraft } from '../model/types'

import * as yup from 'yup'
import { credentialsSchema } from '../model/schema'
import { useAppSelector } from '@/shared/lib/store'
import { selectUserByEmail } from '@/entities/user'
export type CredentialsValues = Pick<RegisterDraft, 'email' | 'password'>

export interface StepCredentialsProps {
  /** Отдаёт значения формы. Валидацию и сохранение черновика подключает P6-02 */
  onNext: (values: CredentialsValues) => void
  /** Ошибка под email, например состояние 1:2627 */
  emailError?: string
  defaultValues?: CredentialsValues
}

/**
 * Поля первого шага с подсказкой пароля и переходом к входу. OAuth подключает страница.
 * Компонент управляет формой и проверяет формат и уникальность email.
 * Сохранение черновика и переход между шагами выполняет страница.
 * @see Figma: «Регистрация 1 шаг» 1:2548, ошибка email 1:2627
 */
export function StepCredentials({ onNext, emailError, defaultValues }: StepCredentialsProps) {
  const {
    register,
    watch,
    handleSubmit,
    setError,
    clearErrors,
    formState: { errors },
  } = useForm<CredentialsValues>({
    defaultValues: defaultValues ?? { email: '', password: '' },
  })
  const email = watch('email')

  const existingUser = useAppSelector((state) => selectUserByEmail(state, email))
  const onSubmit = async (values: CredentialsValues) => {
    clearErrors()
    try {
      const validatedValues = await credentialsSchema.validate(values, {
        abortEarly: false,
      })
      if (existingUser) {
        setError('email', {
          type: 'manual',
          message: 'Email уже используется',
        })
        return
      }
      onNext(validatedValues)
    } catch (error) {
      if (error instanceof yup.ValidationError) {
        error.inner.forEach(({ path, message }) => {
          if (path === 'email' || path === 'password') {
            setError(path, {
              type: 'validation',
              message,
            })
          }
        })
      }
    }
  }
  return (
    <CredentialsForm
      label="Учётные данные"
      submitLabel="Далее"
      onSubmit={handleSubmit(onSubmit)}
      emailInput={{
        ...register('email'),
        error: errors.email?.message ?? emailError,
      }}
      passwordInput={{
        ...register('password'),
        error: errors.password?.message,
        placeholder: 'Придумайте надёжный пароль',
        autoComplete: 'new-password',
        hint: `Пароль должен содержать не менее ${VALIDATION.PASSWORD.MIN} знаков`,
      }}
    >
      Уже есть аккаунт? <Link to={ROUTES.LOGIN}>Войти</Link>
    </CredentialsForm>
  )
}
