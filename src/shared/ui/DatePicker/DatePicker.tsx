import { forwardRef, useEffect, useId, useImperativeHandle, useRef, useState } from 'react'
import { format } from 'date-fns'
import CalendarIcon from '@/shared/assets/icons/calendar.svg?react'
import { useClickOutside } from '@/shared/lib/hooks'
import { Button } from '@/shared/ui/Button'
import { IconButton } from '@/shared/ui/IconButton'
import { Input } from '@/shared/ui/Input'
import { DatePickerCalendar } from './DatePickerCalendar'
import { DISPLAY_FORMAT, ISO_FORMAT, isAllowed, parseDate, parseDisplayDate } from './dateUtils'
import styles from './DatePicker.module.css'

export interface DatePickerProps {
  label?: string
  /** Подтверждённая дата YYYY-MM-DD или null */
  value: string | null
  onChange: (iso: string | null) => void
  /** Допустимые даты включительно, в формате YYYY-MM-DD */
  min?: string
  max?: string
  placeholder?: string
  error?: string
  disabled?: boolean
  id?: string
  name?: string
  onBlur?: () => void
  /** Измените при reset формы, чтобы очистить и неподтверждённый текст при value=null */
  resetKey?: string | number
}

/**
 * Поле даты рождения с календарём, выбором месяца и года и подтверждением даты.
 * Ref ведёт на поле ввода для react-hook-form Controller.
 * @see Figma: 1:1541, 1:2370
 */
export const DatePicker = forwardRef<HTMLInputElement, DatePickerProps>(function DatePicker(
  {
    label = 'Дата рождения',
    value,
    onChange,
    min,
    max,
    placeholder = 'дд.мм.гггг',
    error,
    disabled,
    id,
    name,
    onBlur,
    resetKey,
  },
  ref,
) {
  const [open, setOpen] = useState(false)
  const [draft, setDraft] = useState<Date | null>(null)
  const [unparsedText, setUnparsedText] = useState('')
  const [showInputError, setShowInputError] = useState(false)
  const root = useRef<HTMLDivElement>(null)
  const input = useRef<HTMLInputElement>(null)
  const lastEmittedValue = useRef(value)
  const previousResetKey = useRef(resetKey)
  const dialogId = useId()
  const selected = parseDate(value)
  const minDate = parseDate(min)
  const maxDate = parseDate(max)
  const isOpen = open && !disabled
  const canConfirm = draft && isAllowed(draft, minDate, maxDate)
  const inputValue = selected ? format(selected, DISPLAY_FORMAT) : unparsedText
  const inputError =
    value === null && showInputError && unparsedText
      ? 'Введите корректную дату в допустимом диапазоне'
      : undefined

  useImperativeHandle(ref, () => input.current!, [])
  useClickOutside(
    root,
    () => {
      // blur до удаления календаря: иначе Controller не получит потерю фокуса.
      const active = document.activeElement
      if (active instanceof HTMLElement && root.current?.contains(active)) active.blur()
      setOpen(false)
    },
    isOpen,
  )
  useEffect(() => {
    if (disabled) setOpen(false)
  }, [disabled])

  useEffect(() => {
    const isReset = previousResetKey.current !== resetKey
    previousResetKey.current = resetKey
    if (!isReset && lastEmittedValue.current === value) return
    lastEmittedValue.current = value
    setUnparsedText('')
    setShowInputError(false)
    setDraft(null)
    if (root.current?.querySelector('[role="dialog"]')?.contains(document.activeElement)) {
      input.current?.focus()
    }
    setOpen(false)
  }, [value, resetKey])

  function changeText(text: string) {
    const date = parseDisplayDate(text)
    const next = date && isAllowed(date, minDate, maxDate) ? format(date, ISO_FORMAT) : null
    setUnparsedText(next === null ? text : '')
    setShowInputError(false)
    lastEmittedValue.current = next
    if (next !== value) onChange(next)
  }

  function openCalendar() {
    setDraft(selected ?? null)
    setOpen(true)
  }

  function closeCalendar() {
    setOpen(false)
    input.current?.focus()
  }

  return (
    <div
      ref={root}
      className={styles.root}
      onBlur={(event) => {
        if (event.relatedTarget && event.currentTarget.contains(event.relatedTarget)) return
        if (event.relatedTarget) setOpen(false)
        onBlur?.()
      }}
      onKeyDown={(event) => {
        if (event.key === 'Escape' && isOpen) {
          event.preventDefault()
          event.stopPropagation()
          closeCalendar()
        }
      }}
    >
      <Input
        ref={input}
        id={id}
        name={name}
        label={label}
        error={error ?? inputError}
        disabled={disabled}
        placeholder={placeholder}
        value={inputValue}
        onChange={(event) => changeText(event.target.value)}
        onBlur={() => setShowInputError(true)}
        onKeyDown={(event) => {
          if (event.key === 'Enter' && inputValue && !selected) {
            event.preventDefault()
            setShowInputError(true)
          }
          if (!isOpen && event.key === 'ArrowDown') {
            event.preventDefault()
            openCalendar()
          }
        }}
        rightAction={
          <IconButton
            ariaLabel={isOpen ? 'Закрыть календарь' : 'Открыть календарь'}
            aria-haspopup="dialog"
            aria-expanded={isOpen}
            aria-controls={isOpen ? dialogId : undefined}
            disabled={disabled}
            icon={<CalendarIcon aria-hidden="true" />}
            onClick={isOpen ? closeCalendar : openCalendar}
          />
        }
      />

      {isOpen && (
        <div id={dialogId} className={styles.popup} role="dialog" aria-label="Выбор даты">
          <DatePickerCalendar
            selected={draft}
            initialDate={selected}
            minDate={minDate}
            maxDate={maxDate}
            onChange={setDraft}
          />
          <div className={styles.actions}>
            <Button variant="secondary" onClick={closeCalendar}>
              Отменить
            </Button>
            <Button
              disabled={!canConfirm}
              onClick={() => {
                if (!canConfirm) return
                setUnparsedText('')
                setShowInputError(false)
                const next = format(draft, ISO_FORMAT)
                lastEmittedValue.current = next
                onChange(next)
                closeCalendar()
              }}
            >
              Выбрать
            </Button>
          </div>
        </div>
      )}
    </div>
  )
})
