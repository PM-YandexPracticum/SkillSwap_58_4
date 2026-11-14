import { yupResolver } from '@hookform/resolvers/yup'
import { useForm } from 'react-hook-form'
import { Link } from 'react-router-dom'

import { selectUserByEmail } from '@/entities/user'
import { ROUTES, VALIDATION } from '@/shared/config'
import { useAppSelector } from '@/shared/lib/store'
import { CredentialsForm } from '@/shared/ui/CredentialsForm'

import { credentialsSchema } from '../model/schema'
import type { RegisterDraft } from '../model/types'

export type CredentialsValues = Pick<RegisterDraft, 'email' | 'password'>

export interface StepCredentialsProps {
  /** Отдаёт проверенные значения. Страница сохраняет черновик и открывает шаг 2. */
  onNext: (values: CredentialsValues) => void
  /** Значения ранее пройденного шага из черновика. */
  defaultValues?: CredentialsValues
}

/**
 * Поля первого шага с подсказкой пароля и переходом к входу. OAuth подключает страница.
 * Компонент управляет формой и проверяет формат и уникальность email.
 * Сохранение черновика и переход между шагами выполняет страница.
 * @see Figma: «Регистрация 1 шаг» 1:2548, ошибка email 1:2627
 */
export function StepCredentials({ onNext, defaultValues }: StepCredentialsProps) {
  const {
    register,
    watch,
    handleSubmit,
    setError,
    formState: { errors, touchedFields, isSubmitted, isValid, isSubmitting },
  } = useForm<CredentialsValues>({
    resolver: yupResolver(credentialsSchema),
    // Доступность кнопки пересчитывается при вводе, ошибки видны после blur или отправки.
    mode: 'onTouched',
    defaultValues: defaultValues ?? { email: '', password: '' },
  })
  const email = watch('email')

  const emailTaken = useAppSelector((state) => Boolean(selectUserByEmail(state, email)))
  const onSubmit = (values: CredentialsValues) => {
    if (emailTaken) {
      setError(
        'email',
        { type: 'manual', message: 'Email уже используется' },
        { shouldFocus: true },
      )
      return
    }
    onNext(values)
  }

  return (
    <CredentialsForm
      label="Учётные данные"
      submitLabel="Далее"
      submitDisabled={!isValid || isSubmitting}
      onSubmit={handleSubmit(onSubmit)}
      emailInput={{
        ...register('email'),
        error: errors.email?.message,
      }}
      passwordInput={{
        ...register('password'),
        error: errors.password?.message,
        placeholder: 'Придумайте надёжный пароль',
        autoComplete: 'new-password',
        hint:
          (touchedFields.password || isSubmitted) && !errors.password
            ? 'Надёжный'
            : `Пароль должен содержать не менее ${VALIDATION.PASSWORD.MIN} знаков`,
      }}
    >
      Уже есть аккаунт? <Link to={ROUTES.LOGIN}>Войти</Link>
    </CredentialsForm>
  )
}
