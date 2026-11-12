import SortIcon from '@/shared/assets/icons/sort.svg?react'
import type { SortOrder } from '../model/types'
import styles from './SortToggle.module.css'

export interface SortToggleProps {
  value: SortOrder
  onChange: (value: SortOrder) => void
  className?: string
}

/**
 * Управляемая кнопка «Сначала новые / Сначала старые»; сообщает следующий порядок родителю.
 * Данные не сортирует и store не меняет (подключение — P5-05).
 * @see Figma: каталог с фильтрами (1:2860), поиск (1:2819)
 */
export function SortToggle({ value, onChange, className }: SortToggleProps) {
  return (
    <button
      type="button"
      className={[styles.button, className].filter(Boolean).join(' ')}
      onClick={() => onChange(value === 'newest' ? 'oldest' : 'newest')}
    >
      <SortIcon className={styles.icon} aria-hidden="true" />
      {value === 'newest' ? 'Сначала новые' : 'Сначала старые'}
    </button>
  )
}
