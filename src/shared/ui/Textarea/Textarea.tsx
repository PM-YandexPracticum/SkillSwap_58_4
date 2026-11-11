import { Field } from '../Field'
import { forwardRef, type TextareaHTMLAttributes, type ReactNode } from 'react'
import styles from '../Field/Field.module.css'
import textareaStyles from './Textarea.module.css'

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
  return (
    <Field id={id} label={label} error={error} describedBy={describedBy} invalid={invalid}>
      {(control) => (
        <div className={styles.control}>
          <textarea
            {...props}
            ref={ref}
            {...control}
            className={[
              styles.input,
              textareaStyles.input,
              rightIcon ? styles.withIcon : '',
              className,
            ]
              .filter(Boolean)
              .join(' ')}
          />
          {rightIcon && (
            <span className={styles.icon} aria-hidden="true">
              {rightIcon}
            </span>
          )}
        </div>
      )}
    </Field>
  )
})
