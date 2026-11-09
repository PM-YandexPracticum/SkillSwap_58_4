import { useId, useState } from 'react'
import { RadioGroup } from '@/shared/ui/RadioGroup'

export interface GenderFilterProps {
  /** Дополнительный CSS-класс */
  className?: string
}

const OPTIONS = [
  { value: 'any', label: 'Не имеет значения' },
  { value: 'male', label: 'Мужской' },
  { value: 'female', label: 'Женский' },
]

/**
 * Радио пола автора. До P5-02 выбор только визуальный, без изменения store.
 * @see Figma: «Каталог — фильтры применены» (1:2860)
 */
export function GenderFilter({ className }: GenderFilterProps) {
  const [gender, setGender] = useState('any')
  const name = useId()

  return (
    <RadioGroup
      label="Пол автора"
      name={name}
      options={OPTIONS}
      value={gender}
      onChange={setGender}
      className={className}
    />
  )
}
