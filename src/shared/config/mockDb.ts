/** Настройки «базы данных» в браузере (`shared/api/mock-db`) */
export const MOCK_DB = {
  /** Префикс ключей localStorage: `skillswap_db_users`, `skillswap_db_skills`… */
  STORAGE_PREFIX: 'skillswap_db_',
  /** Задержка каждого «запроса», мс — чтобы был виден Loader, как с настоящим сервером */
  DELAY_MS: 300,
} as const
