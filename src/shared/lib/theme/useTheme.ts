import { useSyncExternalStore } from 'react'
import { getTheme, subscribeTheme, toggleTheme } from './theme'

/** Подписывает UI на общую тему; не создаёт отдельное состояние для каждой кнопки. */
export function useTheme() {
  const theme = useSyncExternalStore(subscribeTheme, getTheme, () => 'light' as const)
  return { theme, toggleTheme }
}
