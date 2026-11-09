import { useId, type FormEventHandler, type ReactNode, type RefAttributes } from 'react'

import { Button } from '@/shared/ui/Button'
import { Input, type InputProps } from '@/shared/ui/Input'
import { PasswordInput, type PasswordInputProps } from '@/shared/ui/PasswordInput'
import styles from './CredentialsForm.module.css'

export interface CredentialsFormProps {
  /** Доступное название формы */
  label: string
  submitLabel: string
  onSubmit: FormEventHandler<HTMLFormElement>
  /** Атрибуты полей и ref, в том числе результат register() из react-hook-form */
  emailInput: InputProps & RefAttributes<HTMLInputElement>
  passwordInput: PasswordInputProps & RefAttributes<HTMLInputElement>
  /** Общая ошибка пары email/пароль. Помечает оба поля, выводится один раз */
  error?: string
  /** Навигация под основной кнопкой */
  children: ReactNode
}

/**
 * Общая вёрстка двух полей, ошибки и действий для входа и первого шага регистрации.
 * Полями и отправкой управляет вызывающая форма; валидации, запросов и сохранения здесь нет.
 * @see Figma: вход 1:2400, ошибка 1:2473, регистрация 1:2548, 1:2627
 */
export function CredentialsForm({
  label,
  submitLabel,
  onSubmit,
  emailInput,
  passwordInput,
  error,
  children,
}: CredentialsFormProps) {
  const errorId = useId()
  const invalidProps = error ? { 'aria-invalid': true } : {}

  return (
    <form className={styles.form} noValidate aria-label={label} onSubmit={onSubmit}>
      <div className={styles.inputsAndError}>
        <div className={styles.fields}>
          <Input
            label="Email"
            type="email"
            placeholder="Введите email"
            autoComplete="email"
            {...emailInput}
            {...invalidProps}
            aria-describedby={
              [emailInput['aria-describedby'], error ? errorId : undefined]
                .filter(Boolean)
                .join(' ') || undefined
            }
          />
          <PasswordInput
            label="Пароль"
            placeholder="Введите ваш пароль"
            autoComplete="current-password"
            {...passwordInput}
            {...invalidProps}
            aria-describedby={
              [passwordInput['aria-describedby'], error ? errorId : undefined]
                .filter(Boolean)
                .join(' ') || undefined
            }
          />
        </div>
        {error && (
          <p id={errorId} className={styles.error} role="alert">
            {error}
          </p>
        )}
      </div>
      <div className={styles.actions}>
        <Button type="submit">{submitLabel}</Button>
        <div className={styles.footer}>{children}</div>
      </div>
    </form>
  )
}
