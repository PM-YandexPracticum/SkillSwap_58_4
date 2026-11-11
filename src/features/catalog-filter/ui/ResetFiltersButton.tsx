import CrossIcon from '@/shared/assets/icons/cross.svg?react'
import actionStyles from './FilterGroup.module.css'
import styles from './ResetFiltersButton.module.css'

export interface ResetFiltersButtonProps {
  /** Дополнительный CSS-класс */
  className?: string
  /** Обработчик сброса передаёт контейнер; без него кнопка остаётся номинальной */
  onClick?: () => void
}

/**
 * Кнопка «Сбросить ×» рядом с заголовком панели; действие передаётся снаружи.
 * @see Figma: «Каталог — фильтры применены» (1:2860)
 */
export function ResetFiltersButton({ className, onClick }: ResetFiltersButtonProps) {
  return (
    <button
      type="button"
      className={[styles.button, actionStyles.action, className].filter(Boolean).join(' ')}
      onClick={onClick}
    >
      Сбросить <CrossIcon className={styles.icon} aria-hidden="true" />
    </button>
  )
}
