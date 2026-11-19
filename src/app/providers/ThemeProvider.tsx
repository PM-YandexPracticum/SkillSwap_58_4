import type { ReactNode } from 'react'
import { useTheme } from '@/shared/lib/theme'

export interface ThemeProviderProps {
  children: ReactNode
}

/**
 * Поддерживает общую подписку на тему на всех маршрутах, в том числе без шапки.
 * Первая инициализация выполняется до React-рендера в main.tsx.
 */
export function ThemeProvider({ children }: ThemeProviderProps) {
  useTheme()
  return <>{children}</>
}
