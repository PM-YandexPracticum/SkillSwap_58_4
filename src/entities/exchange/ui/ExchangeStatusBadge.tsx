import ClockIcon from '@/shared/assets/icons/clock.svg?react'

import styles from './ExchangeStatusBadge.module.css'

export interface ExchangeStatusBadgeProps {
  /** Дополнительный CSS-класс */
  className?: string
}

/**
 * Статичный неинтерактивный бейдж «Обмен предложен» с иконкой часов.
 * Не читает store и не загружает обмены; условие показа определяет вызывающий виджет.
 * Не является live-регионом, не занимает остановку Tab; иконка скрыта от скринридера.
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
