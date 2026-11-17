import { yupResolver } from '@hookform/resolvers/yup'
import { useForm } from 'react-hook-form'
import { Link } from 'react-router-dom'

import { ROUTES } from '@/shared/config'
import { CredentialsForm } from '@/shared/ui/CredentialsForm'
import { loginSchema, type LoginFormValues } from '../model/schema'

export interface LoginFormProps {
  /** Получает email и пароль после проверки формата. */
  onSubmit?: (values: LoginFormValues) => void
  /** Очищает общую ошибку после изменения любого поля. */
  onEdit?: () => void
  /**
   * Общая ошибка входа «Email или пароль введён неверно» (фрейм 1:2473).
   * Оба поля подсвечиваются красным, текст — под паролем; что именно неверно, не подсказываем
   */
  error?: string
}

/**
 * Форма входа: Email, Пароль (с глазом), кнопка «Войти», ссылка «Зарегистрироваться».
 * Кнопки Google / Apple ставит над формой страница — это отдельная фича `auth-oauth`.
 * @see Figma: «Вход» (1:2400), «Вход с неправильными данными» (1:2473)
 */
export function LoginForm({ onSubmit, onEdit, error }: LoginFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors, isValid, isSubmitting },
  } = useForm<LoginFormValues>({
    resolver: yupResolver(loginSchema),
    // Как у первого шага регистрации: валидность обновляется при вводе, ошибки — после blur.
    mode: 'onTouched',
    defaultValues: { email: '', password: '' },
  })
  return (
    <CredentialsForm
      label="Вход"
      submitLabel="Войти"
      submitDisabled={!isValid || isSubmitting}
      onSubmit={handleSubmit((values) => onSubmit?.(values))}
      emailInput={{ ...register('email', { onChange: onEdit }), error: errors.email?.message }}
      passwordInput={{
        ...register('password', { onChange: onEdit }),
        error: errors.password?.message,
      }}
      error={error}
    >
      <Link to={ROUTES.REGISTER}>Зарегистрироваться</Link>
    </CredentialsForm>
  )
}
