import { forwardRef, useEffect, useId, useImperativeHandle, useRef, useState } from 'react'
import { format, isValid, parse, parseISO, startOfDay } from 'date-fns'
import { ru } from 'date-fns/locale'
import Calendar from 'react-datepicker'
import 'react-datepicker/dist/react-datepicker.css'
import CalendarIcon from '@/shared/assets/icons/calendar.svg?react'
import ChevronDown from '@/shared/assets/icons/chevron-down.svg?react'
import { useClickOutside } from '@/shared/lib/hooks'
import { Button } from '@/shared/ui/Button'
import { IconButton } from '@/shared/ui/IconButton'
import { Input } from '@/shared/ui/Input'
import styles from './DatePicker.module.css'

const ISO_FORMAT = 'yyyy-MM-dd'
const DISPLAY_FORMAT = 'dd.MM.yyyy'
const MONTHS = Array.from({ length: 12 }, (_, month) =>
  format(new Date(2000, month, 1), 'LLLL', { locale: ru }),
)

function parseDate(value: string | null | undefined) {
  if (!value || !/^\d{4}-\d{2}-\d{2}$/.test(value)) return undefined
  const date = parseISO(value)
  return isValid(date) ? date : undefined
}

function parseDisplayDate(text: string) {
  const date = parse(text, DISPLAY_FORMAT, new Date(2000, 0, 1))
  return isValid(date) && format(date, DISPLAY_FORMAT) === text ? date : undefined
}

function isAllowed(date: Date, min?: Date, max?: Date) {
  const day = startOfDay(date)
  return (!min || day >= min) && (!max || day <= max)
}

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
  },
  ref,
) {
  const [open, setOpen] = useState(false)
  const [draft, setDraft] = useState<Date | null>(null)
  const [unparsedText, setUnparsedText] = useState('')
  const [showInputError, setShowInputError] = useState(false)
  const root = useRef<HTMLDivElement>(null)
  const input = useRef<HTMLInputElement>(null)
  const monthSelect = useRef<HTMLSelectElement>(null)
  const dialogId = useId()
  const selected = parseDate(value)
  const minDate = parseDate(min)
  const maxDate = parseDate(max)
  const isOpen = open && !disabled
  const initialDate = selected ?? startOfDay(new Date())
  const visibleDate =
    maxDate && initialDate > maxDate
      ? maxDate
      : minDate && initialDate < minDate
        ? minDate
        : initialDate
  const canConfirm = draft && isAllowed(draft, minDate, maxDate)
  const inputValue = selected ? format(selected, DISPLAY_FORMAT) : unparsedText
  const inputError =
    value === null && showInputError && unparsedText
      ? 'Введите корректную дату в допустимом диапазоне'
      : undefined

  useImperativeHandle(ref, () => input.current!, [])
  useClickOutside(root, () => setOpen(false), isOpen)
  useEffect(() => {
    if (disabled) setOpen(false)
    if (isOpen) monthSelect.current?.focus()
  }, [disabled, isOpen])

  useEffect(() => {
    if (value !== null) setUnparsedText('')
  }, [value])

  function changeText(text: string) {
    const date = parseDisplayDate(text)
    const next = date && isAllowed(date, minDate, maxDate) ? format(date, ISO_FORMAT) : null
    setUnparsedText(next === null ? text : '')
    setShowInputError(false)
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
          <Calendar
            inline
            locale={ru}
            calendarStartDay={1}
            openToDate={visibleDate}
            selected={draft}
            minDate={minDate}
            maxDate={maxDate}
            fixedHeight
            shouldCloseOnSelect={false}
            chooseDayAriaLabelPrefix="Выбрать"
            disabledDayAriaLabelPrefix="Недоступно"
            renderCustomDayName={({ day, fullName }) => (
              <>
                <span className="react-datepicker__sr-only">{fullName}</span>
                <span aria-hidden="true">{format(day, 'EEEEEE', { locale: ru })}</span>
              </>
            )}
            onChange={setDraft}
            renderCustomHeader={({ date, changeMonth, changeYear }) => {
              const year = date.getFullYear()
              const first = minDate?.getFullYear() ?? Math.min(1900, year)
              const last = maxDate?.getFullYear() ?? Math.max(2100, year)
              return (
                <div className={styles.header}>
                  <label className={styles.selector}>
                    <select
                      ref={monthSelect}
                      aria-label="Месяц"
                      value={date.getMonth()}
                      onChange={(event) => changeMonth(Number(event.target.value))}
                    >
                      {MONTHS.map((month, index) => (
                        <option
                          key={month}
                          value={index}
                          disabled={
                            (year === minDate?.getFullYear() && index < minDate.getMonth()) ||
                            (year === maxDate?.getFullYear() && index > maxDate.getMonth())
                          }
                        >
                          {month}
                        </option>
                      ))}
                    </select>
                    <ChevronDown aria-hidden="true" />
                  </label>
                  <label className={styles.selector}>
                    <select
                      aria-label="Год"
                      value={year}
                      onChange={(event) => {
                        const nextYear = Number(event.target.value)
                        changeYear(nextYear)
                        if (
                          nextYear === minDate?.getFullYear() &&
                          date.getMonth() < minDate.getMonth()
                        ) {
                          changeMonth(minDate.getMonth())
                        }
                        if (
                          nextYear === maxDate?.getFullYear() &&
                          date.getMonth() > maxDate.getMonth()
                        ) {
                          changeMonth(maxDate.getMonth())
                        }
                      }}
                    >
                      {Array.from({ length: last - first + 1 }, (_, index) => last - index).map(
                        (item) => (
                          <option key={item} value={item}>
                            {item}
                          </option>
                        ),
                      )}
                    </select>
                    <ChevronDown aria-hidden="true" />
                  </label>
                </div>
              )
            }}
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
                onChange(format(draft, ISO_FORMAT))
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
