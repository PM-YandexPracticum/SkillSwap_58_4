import { useEffect, useId, useRef, type InputHTMLAttributes } from 'react'
import EmptyIcon from '@/shared/assets/icons/checkbox-empty.svg?react'
import CheckedIcon from '@/shared/assets/icons/checkbox-done.svg?react'
import PartialIcon from '@/shared/assets/icons/checkbox-remove.svg?react'
import styles from './Checkbox.module.css'

export interface CheckboxProps extends Omit<
  InputHTMLAttributes<HTMLInputElement>,
  'type' | 'onChange' | 'checked' | 'defaultChecked' | 'children'
> {
  /** Текст рядом с чекбоксом */
  label: string
  /** Выбрано ли значение */
  checked: boolean
  /** Выбрана только часть подкатегорий */
  indeterminate?: boolean
  /** Новое состояние: из частичного выбора всегда true */
  onChange: (checked: boolean) => void
  /** Сообщение ошибки формы */
  error?: string
}

/**
 * Управляемый чекбокс. Частичный выбор переключается в полный, затем снимается.
 * Какие подкатегории выбрать, решает родитель.
 * @see Figma: 1:2861, 1:2860
 */
export function Checkbox({
  label,
  checked,
  indeterminate = false,
  onChange,
  error,
  id,
  className,
  'aria-describedby': describedBy,
  'aria-invalid': invalid,
  ...props
}: CheckboxProps) {
  const inputRef = useRef<HTMLInputElement>(null)
  const generatedId = useId()
  const inputId = id ?? generatedId
  const errorId = `${inputId}-error`
  const Icon = indeterminate ? PartialIcon : checked ? CheckedIcon : EmptyIcon

  useEffect(() => {
    if (inputRef.current) inputRef.current.indeterminate = indeterminate
  }, [indeterminate, checked])

  return (
    <div className={[styles.field, className].filter(Boolean).join(' ')}>
      <label className={styles.label} htmlFor={inputId}>
        <input
          {...props}
          ref={inputRef}
          id={inputId}
          type="checkbox"
          className={styles.input}
          checked={checked}
          aria-checked={indeterminate ? 'mixed' : checked}
          aria-invalid={error ? true : invalid}
          aria-describedby={
            [describedBy, error ? errorId : undefined].filter(Boolean).join(' ') || undefined
          }
          onChange={(event) => onChange(indeterminate ? true : event.target.checked)}
        />
        <span className={styles.icon} aria-hidden="true">
          <Icon />
        </span>
        <span>{label}</span>
      </label>
      {error && (
        <p className={styles.error} id={errorId}>
          {error}
        </p>
      )}
    </div>
  )
}
