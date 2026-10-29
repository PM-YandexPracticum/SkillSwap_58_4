/**
 * Ключи localStorage для состояния браузера. Данные «базы» (пользователи, навыки, обмены…)
 * хранятся под ключами с префиксом `MOCK_DB.STORAGE_PREFIX` — см. `shared/config/mockDb.ts`.
 */
export const STORAGE_KEYS = {
  SESSION: 'skillswap_session',
  THEME: 'skillswap_theme',
} as const

export type StorageKey = (typeof STORAGE_KEYS)[keyof typeof STORAGE_KEYS]
