/**
 * Флаги дополнительных возможностей проекта.
 *
 * MVP-функции не прячем за этим конфигом: он нужен только для включения и
 * выключения расширений фазы 9 без изменения маршрутов и компонентов.
 */
export const FEATURE_FLAGS = {
  DARK_THEME: true,
  BADGES: false,
  CHAT: false,
  PWA: false,
} as const

export type FeatureFlag = keyof typeof FEATURE_FLAGS
