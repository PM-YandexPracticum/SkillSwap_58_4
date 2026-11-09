import { CategoriesList } from './CategoriesList'
import styles from './CategoriesMenu.module.css'

export interface CategoriesMenuProps {
  /** Дополнительный CSS-класс панели */
  className?: string
}

/**
 * Панель со статичным CategoriesList, общая для слота Header и страницы `/skills`.
 * Кнопку, Dropdown и открытие/закрытие предоставляет Header; повторного триггера здесь нет.
 * @see Figma: «Все навыки» (1:3165), белая панель 1136 px с отступом 60 px
 */
export function CategoriesMenu({ className }: CategoriesMenuProps) {
  return (
    <div className={[styles.panel, className].filter(Boolean).join(' ')}>
      <CategoriesList />
    </div>
  )
}
