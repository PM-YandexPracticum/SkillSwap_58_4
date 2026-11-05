import type { Meta, StoryObj } from '@storybook/react-vite'

import { createNotification } from '@/entities/notification/testing'

import { NotificationsPanel } from './NotificationsPanel'

import type { NotificationWithName } from './NotificationsPanel'

/** Готовая для фразы форма имени — панель и строка не склоняют */
const RECIPIENT_NAME = 'Ивану'

/** Дата как в макете — «23 мая» (1:2148) */
const MOCK_CREATED_AT = '2026-05-23T10:00:00.000Z'

/** Строка панели: уведомление из фабрики + подготовленное имя */
const createItem = (overrides: Partial<NotificationWithName> = {}): NotificationWithName =>
  ({
    ...createNotification({ createdAt: MOCK_CREATED_AT }),
    userName: RECIPIENT_NAME,
    ...overrides,
  }) as NotificationWithName

/**
 * Окно колокольчика — фрейм 1:2190 (экран с открытой панелью — 1:2148).
 * «Новые уведомления» с «Прочитать все», ниже «Просмотренные» с «Очистить».
 * Записи распределяются по isRead; пусто — «Уведомлений пока нет».
 *
 * По P3-15 обработчики — заглушки: сохранение прочтения — P4-07, подключение к шапке — P7-05.
 */
const meta: Meta<typeof NotificationsPanel> = {
  title: 'widgets/notifications-panel/NotificationsPanel',
  component: NotificationsPanel,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
  },
  decorators: [
    (Story) => (
      <div style={{ width: 556 }}>
        <Story />
      </div>
    ),
  ],
  args: {
    notifications: [],
    onMarkAllRead: () => {},
    onClear: () => {},
    onGo: () => {},
  },
}

export default meta

type Story = StoryObj<typeof meta>

/** Смешанный список: два новых и два просмотренных — как в макете (1:2148) */
export const Default: Story = {
  args: {
    notifications: [
      createItem({ id: 'n1', isRead: false }),
      createItem({ id: 'n2', isRead: false }),
      createItem({ id: 'n3', isRead: true }),
      createItem({ id: 'n4', isRead: true }),
    ],
  },
}

/** Только новые: есть «Прочитать все», блока «Просмотренные» нет */
export const OnlyUnread: Story = {
  args: {
    notifications: [
      createItem({ id: 'n1', isRead: false }),
      createItem({ id: 'n2', isRead: false }),
    ],
  },
}

/** Только просмотренные: есть «Очистить», блока «Новые уведомления» нет */
export const OnlyRead: Story = {
  args: {
    notifications: [createItem({ id: 'n1', isRead: true }), createItem({ id: 'n2', isRead: true })],
  },
}

/** Пустая панель: «Уведомлений пока нет», секций и кнопок нет */
export const Empty: Story = {}
