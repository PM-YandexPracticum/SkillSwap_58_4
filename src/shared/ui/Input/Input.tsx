import { forwardRef, useId, type InputHTMLAttributes, type ReactNode } from 'react'
import styles from './Input.module.css'

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  /** Подпись над полем */
  label?: string
  /** Ошибка формы под полем */
  error?: string
  /** Декоративная иконка справа, например карандаш. Скрыта от скринридера и не кликается */
  rightIcon?: ReactNode
  /**
   * Кнопка справа: «глаз» в PasswordInput (P2-06), «×» очистки у «Города» в Select (P2-09).
   * Кликается и доступна с клавиатуры; подпись для скринридера задаёт сама кнопка (`aria-label`).
   * Если передана, `rightIcon` не показывается — справа одно место.
   */
  rightAction?: ReactNode
}

/**
 * Однострочное поле с подписью, ошибкой и иконкой или кнопкой справа.
 * Ref передаётся на HTML-поле для react-hook-form.
 * @see Figma: 1:2548, 1:2627, 1:2370
 */
export const Input = forwardRef<HTMLInputElement, InputProps>(function Input(
  {
    label,
    error,
    rightIcon,
    rightAction,
    id,
    className,
    'aria-describedby': describedBy,
    'aria-invalid': invalid,
    ...props
  },
  ref,
) {
  const generatedId = useId()
  const fieldId = id ?? generatedId
  const errorId = `${fieldId}-error`
  const hasRight = Boolean(rightAction ?? rightIcon)
  const description =
    [describedBy, error ? errorId : undefined].filter(Boolean).join(' ') || undefined

  return (
    <div className={styles.field}>
      {label && (
        <label className={styles.label} htmlFor={fieldId}>
          {label}
        </label>
      )}
      <div className={styles.control}>
        <input
          {...props}
          ref={ref}
          id={fieldId}
          className={[styles.input, hasRight ? styles.withIcon : '', className]
            .filter(Boolean)
            .join(' ')}
          aria-describedby={description}
          aria-invalid={error ? true : invalid}
        />
        {rightAction ? (
          <span className={styles.action}>{rightAction}</span>
        ) : (
          rightIcon && (
            <span className={styles.icon} aria-hidden="true">
              {rightIcon}
            </span>
          )
        )}
      </div>
      {error && (
        <p id={errorId} className={styles.error}>
          {error}
        </p>
      )}
    </div>
  )
})
