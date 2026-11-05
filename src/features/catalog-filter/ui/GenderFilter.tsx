import { useState } from 'react'
import { RadioGroup } from '@/shared/ui/RadioGroup'

export interface GenderFilterProps {
  /** Дополнительный CSS-класс */
  className?: string
}

export function GenderFilter({ className }: GenderFilterProps) {
  const [mode, setMode] = useState('all')

  // Опции по макету
  const options = [
    { value: 'any', label: 'Не имеет значения' },
    { value: 'male', label: 'Мужской' },
    { value: 'femalu', label: 'Женский' },
  ]

  return (
    <RadioGroup
      label="Пол автора"
      name="catalog-mode"
      options={options}
      value={mode}
      onChange={setMode}
      className={className}
    />
  )
}
