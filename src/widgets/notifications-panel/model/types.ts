import type { Notification } from '@/entities/notification'

/**
 * Уведомление вместе с формой имени получателя в дательном падеже («Ивану»).
 * Панель ничего не склоняет — имя готовит вызывающий код.
 * @see Figma: 1:2148
 */
export type NotificationWithName = Notification & { userName: string }
