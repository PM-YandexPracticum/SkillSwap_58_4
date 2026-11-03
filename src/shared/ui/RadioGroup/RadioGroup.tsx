import { useId, type FieldsetHTMLAttributes } from 'react'
import EmptyIcon from '@/shared/assets/icons/radio-empty.svg?react'
import CheckedIcon from '@/shared/assets/icons/radio-done.svg?react'
import styles from './RadioGroup.module.css'

export interface RadioGroupProps extends Omit<
  FieldsetHTMLAttributes<HTMLFieldSetElement>,
  'onChange' | 'children'
> {
  /** Общее имя HTML-радиокнопок; разные группы должны иметь разные имена */
  name: string
  /** Варианты выбора */
  options: ReadonlyArray<{ value: string; label: string; disabled?: boolean }>
  /** Выбранное значение */
  value: string
  /** Новое выбранное значение */
  onChange: (value: string) => void
  /** Подпись группы, например «Пол автора» */
  label?: string
  /** Сообщение ошибки формы */
  error?: string
}

/**
 * Управляемая группа: один вариант, Tab входит в группу, стрелки меняют выбор.
 * Клавиатурное поведение обеспечивают нативные input type="radio".
 * @see Figma: 1:2861, 1:2860
 */
export function RadioGroup({
  name,
  options,
  value,
  onChange,
  label,
  error,
  className,
  'aria-describedby': describedBy,
  'aria-invalid': invalid,
  ...props
}: RadioGroupProps) {
  const groupId = useId()
  const errorId = `${groupId}-error`

  return (
    <fieldset
      {...props}
      role="radiogroup"
      name={name}
      className={[styles.group, className].filter(Boolean).join(' ')}
      aria-invalid={error ? true : invalid}
      aria-describedby={
        [describedBy, error ? errorId : undefined].filter(Boolean).join(' ') || undefined
      }
    >
      {label && <legend className={styles.legend}>{label}</legend>}
      <div className={styles.options}>
        {options.map((option) => {
          const Icon = value === option.value ? CheckedIcon : EmptyIcon
          return (
            <label key={option.value} className={styles.label}>
              <input
                className={styles.input}
                type="radio"
                name={name}
                value={option.value}
                checked={value === option.value}
                disabled={option.disabled}
                onChange={(event) => onChange(event.target.value)}
              />
              <span className={styles.icon} aria-hidden="true">
                <Icon />
              </span>
              <span>{option.label}</span>
            </label>
          )
        })}
      </div>
      {error && (
        <p className={styles.error} id={errorId}>
          {error}
        </p>
      )}
    </fieldset>
  )
}
