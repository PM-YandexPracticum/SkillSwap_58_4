import { useId } from 'react'
import { RadioGroup } from '@/shared/ui/RadioGroup'
import { useAppDispatch, useAppSelector } from '@/shared/lib/store'
import { setGender } from '../model/catalogFilterSlice'
import { Gender } from '@/entities/user'
import { selectCatalogFilter } from '../model/selectors'

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
  const dispatch = useAppDispatch()

  const gender = useAppSelector(selectCatalogFilter).gender
  const name = useId()

  return (
    <RadioGroup
      label="Пол автора"
      name={name}
      options={OPTIONS}
      value={gender as Gender}
      onChange={(value) => {dispatch(setGender(value as Gender | null))}}
      className={className}
    />
  )
}
