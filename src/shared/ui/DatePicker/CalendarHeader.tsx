import type { RefObject } from 'react'
import { format } from 'date-fns'
import { ru } from 'date-fns/locale'
import type { ReactDatePickerCustomHeaderProps } from 'react-datepicker'
import ChevronDown from '@/shared/assets/icons/chevron-down.svg?react'
import styles from './DatePicker.module.css'

const MONTHS = Array.from({ length: 12 }, (_, month) =>
  format(new Date(2000, month, 1), 'LLLL', { locale: ru }),
)
const FIRST_YEAR = 1900
const LAST_YEAR = 2100

export interface CalendarHeaderProps extends ReactDatePickerCustomHeaderProps {
  minDate?: Date
  maxDate?: Date
  monthSelectRef: RefObject<HTMLSelectElement>
}

/** Выбор видимого месяца и года с учётом включительных границ. @see Figma: 1:1541 */
export function CalendarHeader({
  date,
  changeMonth,
  changeYear,
  minDate,
  maxDate,
  monthSelectRef,
}: CalendarHeaderProps) {
  const year = date.getFullYear()
  const first = minDate?.getFullYear() ?? Math.min(FIRST_YEAR, year)
  const last = maxDate?.getFullYear() ?? Math.max(LAST_YEAR, year)
  function selectYear(nextYear: number) {
    changeYear(nextYear)
    if (nextYear === minDate?.getFullYear() && date.getMonth() < minDate.getMonth())
      changeMonth(minDate.getMonth())
    if (nextYear === maxDate?.getFullYear() && date.getMonth() > maxDate.getMonth())
      changeMonth(maxDate.getMonth())
  }
  return (
    <div className={styles.header}>
      <label className={styles.selector}>
        <select
          ref={monthSelectRef}
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
          onChange={(event) => selectYear(Number(event.target.value))}
        >
          {Array.from({ length: Math.max(0, last - first + 1) }, (_, index) => last - index).map(
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
}
