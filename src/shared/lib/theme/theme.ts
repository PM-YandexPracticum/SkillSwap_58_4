import { FEATURE_FLAGS, STORAGE_KEYS } from '@/shared/config'

export type Theme = 'light' | 'dark'

const SYSTEM_THEME = '(prefers-color-scheme: dark)'
const listeners = new Set<() => void>()
let preference: Theme | null = null
let stopWatching: (() => void) | undefined

const parseTheme = (value: string | null | undefined): Theme | null =>
  value === 'dark' || value === 'light' ? value : null

function readPreference(): Theme | null {
  try {
    return parseTheme(localStorage.getItem(STORAGE_KEYS.THEME))
  } catch {
    return null
  }
}

const systemTheme = (): Theme => window.matchMedia?.(SYSTEM_THEME).matches ? 'dark' : 'light'

/** Один источник темы для приложения и Storybook; color-scheme оформляет нативные поля и скроллбары. */
function applyTheme(theme: Theme) {
  document.documentElement.dataset.theme = theme
  document.documentElement.style.colorScheme = theme
  listeners.forEach((listener) => listener())
}

/** Вызывается до первого React-рендера; сохранённый выбор имеет приоритет над системой. */
export function initializeTheme() {
  if (!FEATURE_FLAGS.DARK_THEME) {
    preference = 'light'
    applyTheme('light')
    return
  }
  preference = readPreference()
  applyTheme(preference ?? systemTheme())
}

export const getTheme = (): Theme => {
  if (!FEATURE_FLAGS.DARK_THEME) return 'light'
  return parseTheme(document.documentElement.dataset.theme) ?? readPreference() ?? systemTheme()
}

/** Явный выбор действует в текущей вкладке, даже если localStorage недоступен или переполнен. */
export function toggleTheme() {
  if (!FEATURE_FLAGS.DARK_THEME) return
  preference = getTheme() === 'dark' ? 'light' : 'dark'
  try {
    localStorage.setItem(STORAGE_KEYS.THEME, preference)
  } catch {
    // Тема остаётся применённой в памяти; сохранять её в другом хранилище не требуется.
  }
  applyTheme(preference)
}

/** Общая подписка: синхронизация вкладок и системной темы без дублирования слушателей. */
export function subscribeTheme(listener: () => void) {
  listeners.add(listener)
  if (listeners.size === 1) {
    initializeTheme()
    if (!FEATURE_FLAGS.DARK_THEME) {
      return () => {
        listeners.delete(listener)
      }
    }
    const media = window.matchMedia?.(SYSTEM_THEME)
    const onSystemChange = () => {
      if (!preference) applyTheme(systemTheme())
    }
    const onStorage = (event: StorageEvent) => {
      if (event.key !== null && event.key !== STORAGE_KEYS.THEME) return
      // session/mock-db используют другие ключи; theme не связана со входом и выходом.
      preference = parseTheme(event.newValue)
      applyTheme(preference ?? systemTheme())
    }
    media?.addEventListener('change', onSystemChange)
    window.addEventListener('storage', onStorage)
    stopWatching = () => {
      media?.removeEventListener('change', onSystemChange)
      window.removeEventListener('storage', onStorage)
    }
  }
  return () => {
    listeners.delete(listener)
    if (listeners.size === 0) {
      stopWatching?.()
      stopWatching = undefined
    }
  }
}
