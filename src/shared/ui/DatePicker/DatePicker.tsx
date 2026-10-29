export interface DatePickerProps {
  label?: string
  /** Выбранная дата в ISO или null */
  value: string | null
  onChange: (iso: string | null) => void
  /** Минимальная дата (ISO) — возраст не старше 100 лет */
  min?: string
  /** Максимальная дата (ISO) — возраст не младше 14 лет */
  max?: string
  /** По макету — «дд.мм.гггг» */
  placeholder?: string
  error?: string
}

/**
 * Поле «Дата рождения» с иконкой календаря — обёртка над библиотекой (тимлид ставит react-datepicker или аналог).
 * Календарь сами не верстаем: подключаем библиотеку, включаем выбор месяца и года, русскую локаль, неделю с понедельника,
 * кнопки «Отменить» / «Выбрать» и стилизуем под макет. Наружу отдаём ISO-строку. Совместим с react-hook-form через `Controller`.
 * @see Figma: «Регистрация 2 шаг» (с открытым календарём), «Профиль_личные данные» (1:2370)
 */
export function DatePicker(_props: DatePickerProps) {
  // TODO: обернуть выбранную библиотеку и стилизовать
  return null
}
