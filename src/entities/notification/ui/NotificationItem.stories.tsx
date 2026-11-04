import type { Meta, StoryObj } from '@storybook/react-vite'

import { createUser } from '@/entities/user/testing'

import type { Notification } from '../model/types'
import { NotificationItem } from './NotificationItem'

/**
 * Фабрика уведомления — по образцу `entities/user/lib/createUser.ts`.
 * Своей фабрики у notification нет - продублирована здесь и в тесте.
 * Данные нейтральные — не копии из `public/db` (docs/rules/testing.md).
 */
const createNotification = (overrides: Partial<Notification> = {}): Notification => ({
  id: 'n1',
  userId: 'author-1',
  toUserId: 'recipient-1',
  exchangeId: 'exchange-1',
  isRead: false,
  createdAt: '2026-01-15T10:00:00.000Z',
  ...overrides,
})

/** Получатель — его имя выводится в тексте «Вы предложили обмен …» */
const recipient = createUser({ id: 'recipient-1', name: 'Иван' })

/**
 * Строка уведомления — как в макете «Каталог -» (1:2148).
 * Непрочитанное — с кнопкой «Перейти», прочитанное — без кнопки.
 */
const meta: Meta<typeof NotificationItem> = {
  title: 'entities/notification/NotificationItem',
  component: NotificationItem,
  tags: ['autodocs'],
  args: {
    notification: createNotification(),
    userName: recipient.name,
    onGo: () => {},
  },
}

export default meta

type Story = StoryObj<typeof meta>

/** Непрочитанное уведомление: есть кнопка «Перейти» (1:2148) */
export const Unread: Story = {
  args: { notification: createNotification({ isRead: false }) },
}

/** Просмотренное уведомление: кнопки нет (1:2148) */
export const Read: Story = {
  args: { notification: createNotification({ isRead: true }) },
}
