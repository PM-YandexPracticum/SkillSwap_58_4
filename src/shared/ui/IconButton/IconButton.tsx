import styles from './IconButton.module.css'

export interface IconButtonProps {
  /** Подпись для скринридера — обязательна, т.к. текста нет */
  ariaLabel: string
  /** Содержимое icon */
  icon: React.ReactNode
  /** Обработчик нажатия */
  onClick?: () => void
}

/**
 * Квадратная кнопка-иконка
 * @see Figma: 1:2765  — шапка:  лайк, тема, колокольчик
 * @see Figma: 1:15143 - шапка: закрыть
 */
export function IconButton({ ariaLabel, onClick, icon }: IconButtonProps) {
  return (
    <button className={styles.iconButton} onClick={onClick} type="button" aria-label={ariaLabel}>
      {icon}
    </button>
  )
}
