export interface MultiSelectProps {
  label?: string
  placeholder?: string
  options: ReadonlyArray<{ value: string; label: string }>
  /** Выбранные значения */
  value: readonly string[]
  /** Новый массив выбранных значений (без мутации старого) */
  onChange: (value: string[]) => void
  error?: string
  disabled?: boolean
}

/**
 * Выпадающий список с чекбоксами — множественный выбор. В закрытом виде выглядит как Select,
 * показывает выбранные значения (лишние — «+N»).
 * @see Figma: «Регистрация 2 шаг» — «Категория…» (1:1673) и «Подкатегория навыка, которому хотите научиться» (1:1717)
 */
export function MultiSelect(_props: MultiSelectProps) {
  // TODO: реализовать на основе Dropdown + Checkbox
  return null
}
