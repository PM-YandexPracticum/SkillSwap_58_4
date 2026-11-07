import styles from './ExchangeStatusBadge.module.css'
import ClockIcon from '@/shared/assets/icons/clock.svg?react'

export interface ExchangeStatusBadgeProps {
  /** Дополнительный CSS-класс */
  className?: string
}

/**
 * Бейдж «Обмен предложен» с иконкой часов.
 * @see Figma: «Каталог - обмен предложен» (1:2106)
 */
export function ExchangeStatusBadge({ className }: ExchangeStatusBadgeProps) {
  return (
    <div className={[styles.badge, className].filter(Boolean).join(' ')}>
      <ClockIcon className={styles.icon} aria-hidden="true" />
      <span>Обмен предложен</span>
    </div>
  )
}
