import { useId } from 'react'
import { RadioGroup } from '@/shared/ui/RadioGroup'
import { useAppDispatch, useAppSelector } from '@/shared/lib/store'
import { selectCatalogFilter } from '../model/selectors'
import { setMode } from '../model/catalogFilterSlice'
import type { FilterMode } from '../model/types'

export interface ModeFilterProps {
  /** Дополнительный CSS-класс */
  className?: string
}

const OPTIONS = [
  { value: 'all', label: 'Всё' },
  { value: 'learn', label: 'Хочу научиться' },
  { value: 'teach', label: 'Могу научить' },
] satisfies ReadonlyArray<{ value: FilterMode; label: string }>

/**
 * Радио режима каталога. Выбор сразу записывается в `catalogFilter`.
 * @see Figma: «Каталог — фильтры применены» (1:2860)
 */
export function ModeFilter({ className }: ModeFilterProps) {
  const dispatch = useAppDispatch()

  const mode = useAppSelector(selectCatalogFilter).mode
  const name = useId()

  return (
    <RadioGroup<FilterMode>
      name={name}
      aria-label="Режим каталога"
      options={OPTIONS}
      value={mode}
      onChange={(value) => dispatch(setMode(value))}
      className={className}
    />
  )
}
