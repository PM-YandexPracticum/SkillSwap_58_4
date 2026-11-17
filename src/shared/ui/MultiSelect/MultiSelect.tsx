import {
  forwardRef,
  useCallback,
  useEffect,
  useId,
  useImperativeHandle,
  useRef,
  useState,
  type KeyboardEvent,
} from 'react'

import ChevronDownIcon from '@/shared/assets/icons/chevron-down.svg?react'
import ChevronUpIcon from '@/shared/assets/icons/chevron-up.svg?react'
import { useClickOutside } from '@/shared/lib/hooks'
import { Checkbox } from '@/shared/ui/Checkbox'
import fieldStyles from '../Select/Select.module.css'
import styles from './MultiSelect.module.css'

export interface MultiSelectProps {
  label?: string
  placeholder?: string
  options: ReadonlyArray<{ value: string; label: string }>
  /** Выбранные значения */
  value: readonly string[]
  /** Новый массив выбранных значений (без мутации старого) */
  onChange: (value: string[]) => void
  /** Вызывается один раз при уходе фокуса за пределы всего поля и списка. */
  onBlur?: () => void
  error?: string
  disabled?: boolean
  /** Первоначально раскрытый список, например для Storybook. Игнорируется при disabled или пустых options. */
  defaultOpen?: boolean
}

/**
 * Выпадающий список с чекбоксами — множественный выбор. В закрытом виде выглядит как Select,
 * показывает выбранные значения (лишние — «+N»). При удалении активного пункта возвращает фокус на поле.
 * @see Figma: «Регистрация 2 шаг» — «Категория…» (1:1673) и «Подкатегория навыка, которому хотите научиться» (1:1717)
 */
export const MultiSelect = forwardRef<HTMLButtonElement, MultiSelectProps>(function MultiSelect(
  {
    label,
    placeholder = 'Выберите значения',
    options,
    value,
    onChange,
    onBlur,
    error,
    disabled = false,
    defaultOpen = false,
  },
  ref,
) {
  const canOpen = !disabled && options.length > 0
  const [isOpen, setIsOpen] = useState(defaultOpen && canOpen)
  const expanded = canOpen && isOpen
  const rootRef = useRef<HTMLDivElement>(null)
  const triggerRef = useRef<HTMLButtonElement>(null)
  useImperativeHandle(ref, () => triggerRef.current!, [])
  const listRef = useRef<HTMLUListElement>(null)
  const focusedOptionRef = useRef<HTMLInputElement | null>(null)
  const focusOnOpen = useRef<'first' | 'last' | null>(null)
  const id = useId()
  const triggerId = `${id}-trigger`
  const labelId = `${id}-label`
  const valueId = `${id}-value`
  const listId = `${id}-list`
  const errorId = `${id}-error`
  const labels = new Map(options.map((option) => [option.value, option.label]))
  const selectedLabels = value.map((item) => labels.get(item)).filter((item) => item !== undefined)
  const firstLabel = selectedLabels[0]
  const remainingCount = selectedLabels.length - 1

  const close = useCallback(() => {
    focusedOptionRef.current = null
    setIsOpen(false)
  }, [])
  useClickOutside(rootRef, close, expanded)

  useEffect(() => {
    if (!canOpen) setIsOpen(false)
  }, [canOpen])

  useEffect(() => {
    const focusedOption = focusedOptionRef.current
    if (!focusedOption || focusedOption.isConnected) return

    // Удалённый пункт не получает blur: браузер переводит фокус на body.
    focusedOptionRef.current = null
    if (document.activeElement === document.body) triggerRef.current?.focus()
  }, [options, expanded])

  useEffect(() => {
    const target = focusOnOpen.current
    focusOnOpen.current = null
    if (!expanded || !target) return

    const inputs = listRef.current?.querySelectorAll('input')
    if (inputs) inputs[target === 'first' ? 0 : inputs.length - 1]?.focus()
  }, [expanded])

  const handleKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (!canOpen) return
    if (event.key === 'Escape' && expanded) {
      event.preventDefault()
      event.stopPropagation()
      close()
      triggerRef.current?.focus()
      return
    }
    if (event.key === 'Enter' && event.target instanceof HTMLInputElement) {
      event.preventDefault()
      event.target.click()
      return
    }
    if (event.key !== 'ArrowDown' && event.key !== 'ArrowUp') return

    event.preventDefault()
    const down = event.key === 'ArrowDown'
    if (!expanded) {
      focusOnOpen.current = down ? 'first' : 'last'
      setIsOpen(true)
      return
    }

    const inputs = Array.from(listRef.current?.querySelectorAll('input') ?? [])
    const current = inputs.findIndex((input) => input === event.target)
    const next = current < 0 && !down ? inputs.length - 1 : current + (down ? 1 : -1)
    inputs[Math.max(0, Math.min(next, inputs.length - 1))]?.focus()
  }

  const Chevron = expanded ? ChevronUpIcon : ChevronDownIcon

  return (
    <div
      ref={rootRef}
      className={[fieldStyles.root, expanded && fieldStyles.rootOpen].filter(Boolean).join(' ')}
      onKeyDown={handleKeyDown}
      onFocusCapture={(event) => {
        focusedOptionRef.current = event.target instanceof HTMLInputElement ? event.target : null
      }}
      onBlur={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget)) {
          close()
          onBlur?.()
        }
      }}
    >
      {label && (
        <label id={labelId} htmlFor={triggerId} className={fieldStyles.label}>
          {label}
        </label>
      )}
      <div className={fieldStyles.control}>
        <div className={fieldStyles.field}>
          <button
            ref={triggerRef}
            id={triggerId}
            type="button"
            className={[
              fieldStyles.trigger,
              expanded && fieldStyles.triggerOpen,
              error && fieldStyles.triggerError,
            ]
              .filter(Boolean)
              .join(' ')}
            aria-expanded={expanded}
            aria-controls={expanded ? listId : undefined}
            aria-labelledby={label ? `${labelId} ${valueId}` : valueId}
            aria-invalid={error ? true : undefined}
            aria-describedby={error ? errorId : undefined}
            disabled={disabled}
            onClick={() => setIsOpen(canOpen && !expanded)}
          >
            <span id={valueId} className={styles.selection}>
              <span
                className={firstLabel === undefined ? fieldStyles.placeholder : fieldStyles.value}
              >
                {firstLabel ?? placeholder}
              </span>
              {remainingCount > 0 && <span className={styles.count}>+{remainingCount}</span>}
            </span>
            <Chevron className={fieldStyles.chevron} aria-hidden="true" />
          </button>
        </div>
        {expanded && (
          <div
            className={[fieldStyles.panel, styles.panel, error && fieldStyles.panelError]
              .filter(Boolean)
              .join(' ')}
          >
            <ul ref={listRef} id={listId} className={`${fieldStyles.options} ${styles.options}`}>
              {options.map((option) => (
                <li key={option.value} className={styles.option}>
                  <Checkbox
                    label={option.label}
                    checked={value.includes(option.value)}
                    onChange={(checked) =>
                      onChange(
                        checked
                          ? [...value, option.value]
                          : value.filter((item) => item !== option.value),
                      )
                    }
                  />
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
      {error && (
        <span id={errorId} className={fieldStyles.error} role="alert">
          {error}
        </span>
      )}
    </div>
  )
})
