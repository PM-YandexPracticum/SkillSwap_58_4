import { STORAGE_KEYS } from '@/shared/config'
import type { Session } from '../model/types'

/** Читает сохранённую сессию из localStorage */
export function loadSession(): Session | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.SESSION)
    return raw ? (JSON.parse(raw) as Session) : null
  } catch {
    return null
  }
}

/** Создаёт мок-сессию для пользователя и сохраняет её */
export function saveSession(userId: string): Session {
  const session: Session = { userId, token: `mock_token_${userId}` }
  localStorage.setItem(STORAGE_KEYS.SESSION, JSON.stringify(session))
  return session
}

/** Удаляет сессию (logout) */
export function clearSession(): void {
  localStorage.removeItem(STORAGE_KEYS.SESSION)
}
