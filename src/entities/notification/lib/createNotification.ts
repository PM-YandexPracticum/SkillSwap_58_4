import type { Notification } from '../model/types'

/**
 * Фабрика уведомления для тестов и stories.
 * Данные нейтральные — не копии из `public/db` (docs/rules/testing.md).
 * `userId`/`toUserId` — строки (`Notification` ссылается на User по id),
 * поэтому `createUser` не нужен: импорт между сущностями в `lib` запрещён (docs/architecture/fsd.md).
 * @param overrides — поля, которые нужно переопределить поверх дефолтов
 */
export const createNotification = (overrides: Partial<Notification> = {}): Notification => ({
  id: 'n1',
  userId: 'author-1',
  toUserId: 'recipient-1',
  exchangeId: 'exchange-1',
  isRead: false,
  createdAt: '2026-01-15T10:00:00.000Z', // фиксированная — в тестах нет «сегодня»
  ...overrides,
})
