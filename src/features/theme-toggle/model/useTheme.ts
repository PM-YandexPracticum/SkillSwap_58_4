export type Theme = 'light' | 'dark'

/**
 * ⭐ Необязательная фича (фаза 9, флаг `FEATURES.DARK_THEME`).
 * Текущая тема и переключатель. Пишет `data-theme` на <html> и сохраняет в localStorage.
 * Тёмные токены уже заготовлены в app/styles/global.css.
 */
export function useTheme(): { theme: Theme; toggleTheme: () => void } {
  // TODO: useLocalStorage(STORAGE_KEYS.THEME, 'light') + useEffect
  throw new Error('Not implemented: useTheme')
}
