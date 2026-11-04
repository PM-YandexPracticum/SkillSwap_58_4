import type { Meta, StoryObj } from '@storybook/react-vite'

import { createUser } from '@/entities/user/testing'

import type { Notification } from '../model/types'
import { NotificationItem } from './NotificationItem'

const author = createUser({ id: 'author-1', name: 'Мария' })
const recipient = createUser({ id: 'recipient-1', name: 'Иван' })

const RECIPIENT_NAME = 'Ивану'

const createNotification = (overrides: Partial<Notification> = {}): Notification => ({
  id: 'n1',
  userId: author.id,
  toUserId: recipient.id,
  exchangeId: 'exchange-1',
  isRead: false,
  createdAt: '2026-05-23T10:00:00.000Z', // как в макете — «23 мая»
  ...overrides,
})

/**
 * Строка уведомления — фрейм 1:2190.
 * Непрочитанное — с кнопкой «Перейти», прочитанное — без кнопки.
 * Decorator задаёт ширину панели макета (436px).
 */
const meta: Meta<typeof NotificationItem> = {
  title: 'entities/notification/NotificationItem',
  component: NotificationItem,
  tags: ['autodocs'],
  decorators: [
    (Story) => (
      <div style={{ width: 436 }}>
        <Story />
      </div>
    ),
  ],
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
