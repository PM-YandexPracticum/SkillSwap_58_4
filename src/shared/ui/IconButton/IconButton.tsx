import styles from './IconButton.module.css'

export interface IconButtonProps {
  /** Подпись для скринридера — обязательна, т.к. текста нет */
  ariaLabel: string
  icon: React.ReactNode
  onClick?: () => void
}

/**
 * Квадратная кнопка-иконка: лайк, тема, колокольчик, поделиться, «Закрыть».
 */
export function IconButton(_props: IconButtonProps) {
  // TODO: реализовать по макету
  return (
    <button className={styles.iconButton} type="button" aria-label={_props.ariaLabel}>
      {_props.icon}
    </button>
  )
}
