import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

import { createNotification } from '@/entities/notification/testing'

import { NotificationsPanel } from './NotificationsPanel'

import type { NotificationWithName } from './NotificationsPanel'

/** Имя в готовой для фразы форме — как в stories (панель не склоняет) */
const RECIPIENT_NAME = 'Ивану'

/** Дата фиксированная — в тестах нет «сегодня» (testing.md) */
const MOCK_CREATED_AT = '2026-05-23T10:00:00.000Z'

/** Строка панели: уведомление из фабрики + имя для фразы */
const createItem = (overrides: Partial<NotificationWithName> = {}): NotificationWithName =>
  ({
    ...createNotification({ createdAt: MOCK_CREATED_AT }),
    userName: RECIPIENT_NAME,
    ...overrides,
  }) as NotificationWithName

/** Рендер с тремя заглушками обработчиков — их поведение проверяют отдельные тесты */
const setup = (notifications: NotificationWithName[]) => {
  const onMarkAllRead = vi.fn()
  const onClear = vi.fn()
  const onGo = vi.fn()

  render(
    <NotificationsPanel
      notifications={notifications}
      onMarkAllRead={onMarkAllRead}
      onClear={onClear}
      onGo={onGo}
    />,
  )

  return { onMarkAllRead, onClear, onGo }
}

describe('NotificationsPanel', () => {
  it('показывает обе секции, если есть новые и просмотренные', () => {
    setup([createItem({ id: 'n1', isRead: false }), createItem({ id: 'n2', isRead: true })])

    expect(screen.getByText('Новые уведомления')).toBeInTheDocument()
    expect(screen.getByText('Просмотренные')).toBeInTheDocument()
  })

  it('показывает только «Новые уведомления», если просмотренных нет', () => {
    setup([createItem({ id: 'n1', isRead: false })])

    expect(screen.getByText('Новые уведомления')).toBeInTheDocument()
    expect(screen.queryByText('Просмотренные')).not.toBeInTheDocument()
  })

  it('показывает только «Просмотренные», если новых нет', () => {
    setup([createItem({ id: 'n1', isRead: true })])

    expect(screen.getByText('Просмотренные')).toBeInTheDocument()
    expect(screen.queryByText('Новые уведомления')).not.toBeInTheDocument()
  })

  it('показывает пустое состояние, если уведомлений нет', () => {
    setup([])

    expect(screen.getByText('Уведомлений пока нет')).toBeInTheDocument()
    expect(screen.queryByRole('button')).not.toBeInTheDocument()
  })

  it('вызывает onMarkAllRead по клику «Прочитать все»', async () => {
    const { onMarkAllRead } = setup([createItem({ id: 'n1', isRead: false })])

    await userEvent.click(screen.getByRole('button', { name: /Прочитать все/ }))

    expect(onMarkAllRead).toHaveBeenCalledTimes(1)
  })

  it('вызывает onClear по клику «Очистить»', async () => {
    const { onClear } = setup([createItem({ id: 'n1', isRead: true })])

    await userEvent.click(screen.getByRole('button', { name: /Очистить/ }))

    expect(onClear).toHaveBeenCalledTimes(1)
  })

  it('вызывает onGo с id уведомления по клику «Перейти»', async () => {
    const { onGo } = setup([createItem({ id: 'n1', isRead: false })])

    await userEvent.click(screen.getByRole('button', { name: /Перейти/ }))

    expect(onGo).toHaveBeenCalledWith('n1')
  })

  it('не показывает кнопку «Перейти» у просмотренного уведомления', () => {
    setup([createItem({ id: 'n1', isRead: true })])

    expect(screen.queryByRole('button', { name: /Перейти/ })).not.toBeInTheDocument()
  })
})
