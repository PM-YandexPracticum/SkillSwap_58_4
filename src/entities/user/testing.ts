/**
 * Публичный API для тестов и stories: `import { createUser } from '@/entities/user/testing'`.
 * Отдельно от `index.ts`, потому что там `createUser` — запрос к «базе» из `api/`.
 */
export { createUser } from './lib/createUser'
