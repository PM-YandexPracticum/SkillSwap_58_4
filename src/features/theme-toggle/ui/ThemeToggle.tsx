import MoonIcon from '@/shared/assets/icons/moon.svg?react'
import SunIcon from '@/shared/assets/icons/sun.svg?react'
import { FEATURE_FLAGS } from '@/shared/config'
import { IconButton } from '@/shared/ui/IconButton'
import { useTheme } from '../model/useTheme'
import styles from './ThemeToggle.module.css'

export interface ThemeToggleProps {
  /** Дополнительный CSS-класс */
  className?: string
}

/**
 * Переключает общую тему; подпись называет следующее действие, aria-pressed — текущее состояние.
 * @see Figma: место переключателя в шапке 1:2861, 1:2996; тёмная палитра — дополнение P9-03.
 */
export function ThemeToggle({ className }: ThemeToggleProps) {
  const { theme, toggleTheme } = useTheme()
  if (!FEATURE_FLAGS.DARK_THEME) return null

  const dark = theme === 'dark'
  return (
    <IconButton
      className={className}
      ariaLabel={dark ? 'Включить светлую тему' : 'Включить тёмную тему'}
      aria-pressed={dark}
      icon={
        dark ? (
          <SunIcon className={styles.icon} aria-hidden="true" />
        ) : (
          <MoonIcon className={styles.icon} aria-hidden="true" />
        )
      }
      onClick={toggleTheme}
    />
  )
}
