import type { ReactNode } from 'react'

interface ThemeProviderProps {
  children: ReactNode
}

/**
 * Применяет сохранённую тему (`data-theme` на <html>) при старте приложения.
 * ⭐ Необязательная фича (фаза 9): пока не реализована, просто отдаёт children.
 */
export function ThemeProvider({ children }: ThemeProviderProps) {
  // TODO: useTheme() из features/theme-toggle
  return <>{children}</>
}
