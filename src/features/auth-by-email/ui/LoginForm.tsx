import { useForm } from 'react-hook-form'
import { Link } from 'react-router-dom'

import { ROUTES } from '@/shared/config'
import { CredentialsForm } from '@/shared/ui/CredentialsForm'
import type { LoginFormValues } from '../model/schema'

export interface LoginFormProps {
  /** Нажали «Войти» — получает введённые email и пароль. Проверку пары и вход подключит P4-09 */
  onSubmit?: (values: LoginFormValues) => void
  /**
   * Общая ошибка входа «Email или пароль введён неверно…» (фрейм 1:2473).
   * Оба поля подсвечиваются красным, текст — под паролем; что именно неверно, не подсказываем
   */
  error?: string
}

/**
 * Форма входа: Email, Пароль (с глазом), кнопка «Войти», ссылка «Зарегистрироваться».
 * Пока вёрстка: правила полей (yup) и проверку пары email/пароль подключит P4-09.
 * Кнопки Google / Apple ставит над формой страница — это отдельная фича `auth-oauth`.
 * @see Figma: «Вход» (1:2400), «Вход с неправильными данными» (1:2473)
 */
export function LoginForm({ onSubmit, error }: LoginFormProps) {
  const { register, handleSubmit } = useForm<LoginFormValues>({
    defaultValues: { email: '', password: '' },
  })
  return (
    <CredentialsForm
      label="Вход"
      submitLabel="Войти"
      onSubmit={handleSubmit((values) => onSubmit?.(values))}
      emailInput={register('email')}
      passwordInput={register('password')}
      error={error}
    >
      <Link to={ROUTES.REGISTER}>Зарегистрироваться</Link>
    </CredentialsForm>
  )
}
