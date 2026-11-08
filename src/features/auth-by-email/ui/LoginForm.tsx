import { useId } from 'react'
import { useForm } from 'react-hook-form'
import { Link } from 'react-router-dom'

import { ROUTES } from '@/shared/config'
import { Button } from '@/shared/ui/Button'
import { Input } from '@/shared/ui/Input'
import { PasswordInput } from '@/shared/ui/PasswordInput'
import type { LoginFormValues } from '../model/schema'
import styles from './LoginForm.module.css'

export interface LoginFormProps {
  /** Нажали «Войти» — получает введённые email и пароль. Проверку пары и вход подключит P4-09 */
  onSubmit?: (values: LoginFormValues) => void
  /** Вызывается после успешного входа (P4-09) */
  onSuccess?: () => void
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
  const errorId = useId()
  const invalidProps = error ? { 'aria-invalid': true, 'aria-describedby': errorId } : {}

  return (
    <form
      className={styles.form}
      noValidate
      aria-label="Вход"
      onSubmit={handleSubmit((values) => onSubmit?.(values))}
    >
      <div className={styles.fields}>
        <Input
          label="Email"
          type="email"
          placeholder="Введите email"
          autoComplete="email"
          {...invalidProps}
          {...register('email')}
        />
        <PasswordInput
          label="Пароль"
          placeholder="Введите ваш пароль"
          autoComplete="current-password"
          {...invalidProps}
          {...register('password')}
        />
        {error && (
          <p id={errorId} className={styles.error} role="alert">
            {error}
          </p>
        )}
      </div>

      <div className={styles.actions}>
        <Button type="submit">Войти</Button>
        <Link className={styles.link} to={ROUTES.REGISTER}>
          Зарегистрироваться
        </Link>
      </div>
    </form>
  )
}
