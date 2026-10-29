export interface SelectProps {
  label?: string
  placeholder?: string
  options: ReadonlyArray<{ value: string; label: string }>
  /** Выбранное значение или null («Не указан») */
  value: string | null
  onChange: (value: string | null) => void
  /**
   * Список с поиском: в поле можно печатать, варианты фильтруются по введённому тексту, справа «×».
   * Нужен для «Город» (в макете «Са» → «Санкт-Петербург, Самара, Саратов»).
   */
  searchable?: boolean
  error?: string
  disabled?: boolean
}

/**
 * Выпадающий список с одним выбором: «Пол» (Не указан / Мужской / Женский), «Город», «Категория», «Подкатегория».
 * @see Figma: «Регистрация 2 шаг» — открытый «Пол» (1:1585), «Город» с поиском (1:1629)
 */
export function Select(_props: SelectProps) {
  // TODO: реализовать по макету
  return null
}
