import type { Meta, StoryObj } from '@storybook/react-vite'

import { createNotification } from '@/entities/notification/testing'
import { DATA_ERRORS } from '@/shared/config'

import { NotificationsPanel } from './NotificationsPanel'

import type { NotificationWithName } from './NotificationsPanel'

/** Готовая для фразы форма имени — панель и строка не склоняют */
const RECIPIENT_NAME = 'Ивану'

/** Дата как в макете — «23 мая» (1:2148) */
const MOCK_CREATED_AT = '2026-05-23T10:00:00.000Z'

/** Строка панели: уведомление из фабрики + подготовленное имя */
const createItem = (overrides: Partial<NotificationWithName> = {}): NotificationWithName => ({
  ...createNotification({ createdAt: MOCK_CREATED_AT }),
  userName: RECIPIENT_NAME,
  ...overrides,
})

/**
 * Окно колокольчика — фрейм 1:2190 (экран с открытой панелью — 1:2148).
 * «Новые уведомления» с «Прочитать все», ниже «Просмотренные» с «Очистить».
 * Записи распределяются по isRead; пусто — «Уведомлений пока нет».
 *
 * LoadError — ошибка загрузки, MarkAllReadError, ClearError — ошибки операции;
 * Эти состояния добавлены по аудиту P7-05; в макете их нет.
 * Обработчики — заглушки для изолированной демонстрации. В приложении подключение к шапке
 * и Redux выполняет MainLayout (P7-05).
 */
const meta: Meta<typeof NotificationsPanel> = {
  title: 'widgets/notifications-panel/NotificationsPanel',
  component: NotificationsPanel,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
    design: {
      type: 'figma',
      url: 'https://www.figma.com/design/40gXmyAoxwwnb9kBxI5B8y/SkillSwap-Red.1-?node-id=1-2190',
    },
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
    status: 'succeeded',
    loadError: null,
    actionError: null,
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

/** Первоначальная загрузка не выглядит как пустой список. */
export const Loading: Story = { args: { status: 'loading' } }

/** Операция идёт: список остаётся, «Прочитать все» и «Очистить» недоступны. */
export const Busy: Story = {
  args: {
    status: 'loading',
    notifications: [createItem({ id: 'n1' }), createItem({ id: 'n2', isRead: true })],
  },
}

/**
 * Ошибка загрузки: вместо списка — сообщение и «Повторить», данных нет.
 * Текст — из `DATA_ERRORS.LOAD_NOTIFICATIONS`, как в приложении.
 * Состояния нет в макете 1:2148 — добавлено по аудиту P7-05.
 */
export const LoadError: Story = {
  args: {
    status: 'failed',
    loadError: DATA_ERRORS.LOAD_NOTIFICATIONS,
    onRetry: () => {},
  },
}

/**
 * Ошибка «Прочитать все»: текст над секцией «Новые уведомления», список не скрыт.
 * Не из макета 1:2148 — добавлено в P7-05 (аудит 13.11.2026).
 */
export const MarkAllReadError: Story = {
  args: {
    notifications: [
      createItem({ id: 'n1', isRead: false }),
      createItem({ id: 'n2', isRead: true }),
    ],
    actionError: DATA_ERRORS.READ_NOTIFICATIONS,
  },
}

/**
 * Ошибка «Очистить»: тот же вид, но текст про очистку.
 * Не из макета 1:2148 — добавлено в P7-05 (аудит 13.11.2026).
 */
export const ClearError: Story = {
  args: {
    notifications: [
      createItem({ id: 'n1', isRead: false }),
      createItem({ id: 'n2', isRead: true }),
    ],
    actionError: DATA_ERRORS.CLEAR_NOTIFICATIONS,
  },
}
