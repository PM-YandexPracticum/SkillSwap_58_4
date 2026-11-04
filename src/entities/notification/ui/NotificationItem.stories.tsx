import type { Meta, StoryObj } from '@storybook/react-vite'

import { createUser } from '@/entities/user/testing'

import type { Notification } from '../model/types'
import { NotificationItem } from './NotificationItem'

/** Получатель — id идёт в `toUserId`, склонённая форма имени - в `userName`. */
const author = createUser({ id: 'author-1', name: 'Мария' })
const recipient = createUser({ id: 'recipient-1', name: 'Иван' })

/** Готовая для фразы форма имени — компонент не склоняет. */
const RECIPIENT_NAME = 'Ивану'

/**
 * Фабрика уведомления — по образцу `entities/user/lib/createUser.ts`.
 * Своей фабрики у notification нет - продублирована здесь и в тесте.
 * Данные нейтральные — не копии из `public/db` (docs/rules/testing.md).
 */
const createNotification = (overrides: Partial<Notification> = {}): Notification => ({
  id: 'n1',
  userId: author.id,
  toUserId: recipient.id,
  exchangeId: 'exchange-1', // фабрики exchange пока нет
  isRead: false,
  createdAt: '2026-01-15T10:00:00.000Z',
  ...overrides,
})

/**
 * Строка уведомления — фрейм 1:2190.
 * Непрочитанное — с кнопкой «Перейти», прочитанное — без кнопки.
 */
const meta: Meta<typeof NotificationItem> = {
  title: 'entities/notification/NotificationItem',
  component: NotificationItem,
  tags: ['autodocs'],
  args: {
    notification: createNotification(),
    userName: RECIPIENT_NAME,
    onGo: () => {},
  },
}

export default meta

type Story = StoryObj<typeof meta>

/** Непрочитанное уведомление: есть кнопка «Перейти» (1:2190) */
export const Unread: Story = {
  args: { notification: createNotification({ isRead: false }) },
}

/** Просмотренное уведомление: кнопки нет (1:2190) */
export const Read: Story = {
  args: { notification: createNotification({ isRead: true }) },
}
