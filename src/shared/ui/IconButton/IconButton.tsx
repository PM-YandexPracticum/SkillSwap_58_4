import type { ButtonHTMLAttributes, ReactNode } from 'react'

import styles from './IconButton.module.css'

export interface IconButtonProps extends Omit<
  ButtonHTMLAttributes<HTMLButtonElement>,
  'aria-label' | 'children'
> {
  /** Подпись для скринридера — обязательна, т.к. текста нет */
  ariaLabel: string
  /** Содержимое icon */
  icon: ReactNode
}

/**
 * Квадратная кнопка-иконка
 * @see Figma: 1:2765  — шапка:  лайк, тема, колокольчик
 * @see Figma: 1:15143 - шапка: закрыть
 */
export function IconButton({ ariaLabel, icon, className, ...buttonProps }: IconButtonProps) {
  return (
    <button
      {...buttonProps}
      className={[styles.iconButton, className].filter(Boolean).join(' ')}
      type="button"
      aria-label={ariaLabel}
    >
      {icon}
    </button>
  )
}
