import { STORAGE_KEYS } from '@/shared/config'

import type { Session } from '../model/types'

/** Похоже ли значение из localStorage на сессию: его могли испортить руками или старой версией сайта */
function isSession(value: unknown): value is Session {
  if (typeof value !== 'object' || value === null) return false
  const { userId, token } = value as Record<string, unknown>
  return typeof userId === 'string' && userId !== '' && typeof token === 'string'
}

/**
 * Читает сохранённую сессию из localStorage — так вошедший остаётся вошедшим после перезагрузки.
 * Нет записи, чужие данные или localStorage недоступен — гость (`null`), а не ошибка.
 */
export function loadSession(): Session | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.SESSION)
    const value: unknown = raw ? JSON.parse(raw) : null
    return isSession(value) ? value : null
  } catch {
    return null
  }
}

/**
 * Создаёт мок-сессию для пользователя и сохраняет её.
 * Если localStorage недоступен, сессия всё равно возвращается: вход работает до перезагрузки страницы.
 */
export function saveSession(userId: string): Session {
  const session: Session = { userId, token: `mock_token_${userId}` }
  try {
    localStorage.setItem(STORAGE_KEYS.SESSION, JSON.stringify(session))
  } catch {
    // localStorage недоступен — сессия живёт только в store до перезагрузки
  }
  return session
}

/** Удаляет сессию (выход). Если localStorage недоступен — удалять нечего */
export function clearSession(): void {
  try {
    localStorage.removeItem(STORAGE_KEYS.SESSION)
  } catch {
    // localStorage недоступен — в нём и стирать нечего
  }
}
