import { useId, type AriaAttributes, type ReactNode } from 'react'
import styles from './Field.module.css'

export interface FieldControlProps {
  id: string
  'aria-describedby'?: string
  'aria-invalid'?: AriaAttributes['aria-invalid']
}

export interface FieldProps {
  id?: string
  label?: string
  error?: string
  describedBy?: string
  invalid?: AriaAttributes['aria-invalid']
  children: (control: FieldControlProps) => ReactNode
}

/** Общая подпись и ошибка Input/Textarea. Рендер поля и ref остаются у конкретного контрола.
 * @see Figma: поля регистрации (1:2548) и личных данных (1:2370).
 */
export function Field({ id, label, error, describedBy, invalid, children }: FieldProps) {
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
      {children({
        id: fieldId,
        'aria-describedby': description,
        'aria-invalid': error ? true : invalid,
      })}
      {error && (
        <p id={errorId} className={styles.error}>
          {error}
        </p>
      )}
    </div>
  )
}
