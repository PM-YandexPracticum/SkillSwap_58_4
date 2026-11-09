import { useId, useState } from 'react'
import { RadioGroup } from '@/shared/ui/RadioGroup'

export interface ModeFilterProps {
  /** Дополнительный CSS-класс */
  className?: string
}

const OPTIONS = [
  { value: 'all', label: 'Всё' },
  { value: 'learn', label: 'Хочу научиться' },
  { value: 'teach', label: 'Могу научить' },
]

/**
 * Радио режима каталога. До P5-02 выбор только визуальный, без изменения store.
 * @see Figma: «Каталог — фильтры применены» (1:2860)
 */
export function ModeFilter({ className }: ModeFilterProps) {
  const [mode, setMode] = useState('all')
  const name = useId()

  return (
    <RadioGroup
      name={name}
      aria-label="Режим каталога"
      options={OPTIONS}
      value={mode}
      onChange={setMode}
      className={className}
    />
  )
}
