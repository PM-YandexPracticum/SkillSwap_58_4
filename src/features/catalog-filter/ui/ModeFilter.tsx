import { RadioGroup } from '@/shared/ui/RadioGroup'
import { useState } from 'react'
import styles from './ModeFilter.module.css'

export interface ModeFilterProps {
  /** Дополнительный CSS-класс */
  className?: string
}

/**
 * Радио «Всё / Хочу научиться / Могу научить».
 */
export function ModeFilter({ className }: ModeFilterProps) {
  // Локальный стейт для визуализации
  const [mode, setMode] = useState('all')

  const options = [
    { value: 'all', label: 'Всё' },
    { value: 'learn', label: 'Хочу научиться' },
    { value: 'teach', label: 'Могу научить' },
  ]

  return (
    <RadioGroup
      name="catalog-mode"
      options={options}
      value={mode}
      onChange={setMode}
      className={[styles.modeFilter, className].filter(Boolean).join(' ')}
    />
  )
}
