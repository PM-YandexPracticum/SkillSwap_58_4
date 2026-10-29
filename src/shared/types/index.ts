/**
 * Общие утилитарные типы, не привязанные к бизнес-сущностям.
 * Доменные типы (User, Skill, ...) живут в `entities/<name>/model/types.ts`.
 */

/** Идентификатор сущности */
export type ID = string

/** Дата в формате ISO 8601, например `2025-10-28T12:00:00.000Z` */
export type ISODateString = string

/** Статус асинхронной загрузки для Redux-слайсов */
export type LoadingStatus = 'idle' | 'loading' | 'succeeded' | 'failed'
