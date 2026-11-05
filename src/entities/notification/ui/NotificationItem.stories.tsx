import type { Meta, StoryObj } from '@storybook/react-vite'

import { createNotification } from '../testing'
import { NotificationItem } from './NotificationItem'

/** Готовая для фразы форма имени — компонент не склоняет. */
const RECIPIENT_NAME = 'Ивану'

/** Дата как в макете — «23 мая» (1:2148). */
const MOCK_CREATED_AT = '2026-05-23T10:00:00.000Z'

/**
 * Строка уведомления — фрейм 1:2190.
 * Непрочитанное — с кнопкой «Перейти», прочитанное — без кнопки.
 * Decorator задаёт ширину панели макета (436px — Notification 1:2148).
 */
const meta: Meta<typeof NotificationItem> = {
  title: 'entities/notification/NotificationItem',
  component: NotificationItem,
  tags: ['autodocs'],
  parameters: {
    design: {
      type: 'figma',
      url: 'https://www.figma.com/design/40gXmyAoxwwnb9kBxI5B8y/SkillSwap-Red.1-?node-id=1-2190',
    },
  },
  decorators: [
    (Story) => (
      <div style={{ width: 436 }}>
        <Story />
      </div>
    ),
  ],
  args: {
    notification: createNotification({ createdAt: MOCK_CREATED_AT }),
    userName: RECIPIENT_NAME,
    onGo: () => {},
  },
}

export default meta

type Story = StoryObj<typeof meta>

/** Непрочитанное уведомление: есть кнопка «Перейти» (1:2190) */
export const Unread: Story = {
  args: { notification: createNotification({ isRead: false, createdAt: MOCK_CREATED_AT }) },
}

/** Просмотренное уведомление: кнопки нет (1:2190) */
export const Read: Story = {
  args: { notification: createNotification({ isRead: true, createdAt: MOCK_CREATED_AT }) },
}
