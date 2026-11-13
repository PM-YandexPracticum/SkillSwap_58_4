import { useId } from 'react'
import { RadioGroup } from '@/shared/ui/RadioGroup'
import { useAppDispatch, useAppSelector } from '@/shared/lib/store'
import { setGender } from '../model/catalogFilterSlice'
import type { Gender } from '@/entities/user'
import { selectCatalogFilter } from '../model/selectors'

export interface GenderFilterProps {
  /** Дополнительный CSS-класс */
  className?: string
}

type GenderOption = Gender | 'any'

const OPTIONS = [
  { value: 'any', label: 'Не имеет значения' },
  { value: 'male', label: 'Мужской' },
  { value: 'female', label: 'Женский' },
] satisfies ReadonlyArray<{ value: GenderOption; label: string }>

/**
 * Радио пола автора. Выбор сразу записывается в `catalogFilter`.
 * @see Figma: «Каталог — фильтры применены» (1:2860)
 */
export function GenderFilter({ className }: GenderFilterProps) {
  const dispatch = useAppDispatch()

  const gender = useAppSelector((state) => selectCatalogFilter(state).gender)
  const name = useId()

  return (
    <RadioGroup<GenderOption>
      label="Пол автора"
      name={name}
      options={OPTIONS}
      value={gender ?? 'any'}
      onChange={(value) => {
        dispatch(setGender(value === 'any' ? null : value))
      }}
      className={className}
    />
  )
}
