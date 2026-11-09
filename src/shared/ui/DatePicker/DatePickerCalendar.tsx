import { useEffect, useRef } from 'react'
import { format, startOfDay } from 'date-fns'
import { ru } from 'date-fns/locale'
import Calendar from 'react-datepicker'
import 'react-datepicker/dist/react-datepicker.css'
import { CalendarHeader } from './CalendarHeader'

export interface DatePickerCalendarProps {
  selected: Date | null
  initialDate?: Date
  minDate?: Date
  maxDate?: Date
  onChange: (date: Date | null) => void
}

/** Библиотечная сетка и русский заголовок календаря. @see Figma: 1:1541 */
export function DatePickerCalendar({
  selected,
  initialDate,
  minDate,
  maxDate,
  onChange,
}: DatePickerCalendarProps) {
  const monthSelect = useRef<HTMLSelectElement>(null)
  const initial = initialDate ?? startOfDay(new Date())
  const visibleDate =
    maxDate && initial > maxDate ? maxDate : minDate && initial < minDate ? minDate : initial
  useEffect(() => monthSelect.current?.focus(), [])

  return (
    <Calendar
      inline
      locale={ru}
      calendarStartDay={1}
      openToDate={visibleDate}
      selected={selected}
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
      onChange={onChange}
      renderCustomHeader={(props) => (
        <CalendarHeader
          {...props}
          minDate={minDate}
          maxDate={maxDate}
          monthSelectRef={monthSelect}
        />
      )}
    />
  )
}
