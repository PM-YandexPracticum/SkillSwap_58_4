import styles from './Button.module.css'

export interface ButtonProps {
  /** Вариант оформления кнопки */
  variant?: 'primary' | 'secondary' | 'ghost'
  /** Тип кнопки */
  type?: 'button' | 'submit'
  /** Отключает кнопку */
  disabled?: boolean
  /** Обработчик нажатия */
  onClick?: () => void
  /** Содержимое кнопки */
  children: React.ReactNode
  /** Дополнительный CSS-класс (например, для отступов или ширины) */
  className?: string // <--- 1. ДОБАВИЛИ В ИНТЕРФЕЙС
}

/**
 * Кнопка с текстом и несколькими вариантами оформления.
 * @see Figma: 1:2861 — шапка: «Войти», «Зарегистрироваться»
 */
export function Button({
  variant = 'primary',
  type = 'button',
  disabled,
  onClick,
  children,
  className, // <--- 2. ДОБАВИЛИ В АРГУМЕНТЫ
}: ButtonProps) {
  return (
    <button
      // 3. СКЛЕИВАЕМ БАЗОВЫЕ КЛАССЫ, КЛАСС ВАРИАНТА И ВНЕШНИЙ КЛАСС
      className={[styles.button, styles[variant], className].filter(Boolean).join(' ')}
      disabled={disabled}
      type={type}
      onClick={onClick}
    >
      {children}
    </button>
  )
}
