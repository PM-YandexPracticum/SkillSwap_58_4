import styles from './Button.module.css'

export interface ButtonProps {
  variant?: 'primary' | 'secondary' | 'ghost'
  type?: 'button' | 'submit'
  disabled?: boolean
  onClick?: () => void
  children: React.ReactNode
}

/**
 * Кнопка. Варианты из макета: primary (зелёная «Подробнее», «Далее»), secondary (белая с обводкой «Войти»), ghost (текстовая «Смотреть все»).
 */
export function Button(_props: ButtonProps) {
  // TODO: реализовать по макету
  return (
    <button
      className={`${styles.button} ${styles[_props.variant || 'primary']}`}
      disabled={_props.disabled}
    >
      {_props.children}
    </button>
  )
}
