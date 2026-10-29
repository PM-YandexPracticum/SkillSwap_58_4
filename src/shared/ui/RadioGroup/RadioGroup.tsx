export interface RadioGroupProps {
  name: string
  options: ReadonlyArray<{ value: string; label: string }>
  value: string
  onChange: (value: string) => void
}

/**
 * Группа радиокнопок: «Всё / Хочу научиться / Могу научить», «Пол автора».
 */
export function RadioGroup(_props: RadioGroupProps) {
  // TODO: реализовать по макету
  return null
}
