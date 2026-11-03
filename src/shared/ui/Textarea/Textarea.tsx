import { forwardRef, useId, type TextareaHTMLAttributes, type ReactNode } from 'react'
import styles from './Textarea.module.css'

export interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  /** Подпись над полем */
  label?: string
  /** Ошибка формы под полем */
  error?: string
  /** Декоративная иконка справа, например карандаш */
  rightIcon?: ReactNode
}

/**
 * Многострочное поле с подписью, ошибкой и декоративной иконкой.
 * Ref передаётся на HTML-поле для react-hook-form.
 * @see Figma: 1:2548, 1:2627, 1:2370
 */
export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(function Textarea(
  {
    label,
    error,
    rightIcon,
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
        <textarea
          {...props}
          ref={ref}
          id={fieldId}
          className={[styles.input, rightIcon ? styles.withIcon : '', className]
            .filter(Boolean)
            .join(' ')}
          aria-describedby={description}
          aria-invalid={error ? true : invalid}
        />
        {rightIcon && (
          <span className={styles.icon} aria-hidden="true">
            {rightIcon}
          </span>
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
