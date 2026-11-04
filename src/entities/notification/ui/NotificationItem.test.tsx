import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

import { createUser } from '@/entities/user/testing'
import { formatDate } from '@/shared/lib/helpers'

import { NotificationItem } from './NotificationItem'
import type { Notification } from '../model/types'

/** Отправитель — его id подставляется в `userId` уведомления. */
const author = createUser({ id: 'author-1', name: 'Мария' })

/** Получатель — id — в `toUserId`, склонённая форма имени передаётся в `userName`. */
const recipient = createUser({ id: 'recipient-1', name: 'Иван' })

/** Готовая для фразы форма имени — компонент не склоняет. */
const RECIPIENT_NAME = 'Ивану'

/**
 * Фабрика уведомления — по образцу `entities/user/lib/createUser.ts`.
 * `overrides` — поля, которые нужно переопределить поверх дефолтов.
 * Своей фабрики у notification пока нет (`entities/notification/testing.ts` отсутствует),
 * поэтому она живёт локально в тесте.
 * Данные нейтральные — не копии из `public/db`, как требует docs/rules/testing.md.
 */
const createNotification = (overrides: Partial<Notification> = {}): Notification => ({
  id: 'n1',
  userId: author.id,
  toUserId: recipient.id,
  exchangeId: 'exchange-1', // фабрики exchange пока нет
  isRead: false,
  createdAt: '2026-01-15T10:00:00.000Z', // фиксированная дата — в тестах нет «сегодня»
  ...overrides,
})

/**
 * Хэлпер. Рендер «по умолчанию»: имя и колбэк подставляются, состояние — через overrides.
 * Возвращает onGo, чтобы проверить вызов колбэка в тесте.
 */
const renderItem = (overrides: Partial<Notification> = {}, userName = RECIPIENT_NAME) => {
  const onGo = vi.fn()

  render(
    <NotificationItem
      notification={createNotification(overrides)}
      userName={userName}
      onGo={onGo}
    />,
  )

  return { onGo }
}

describe('NotificationItem', () => {
  it('показывает имя пользователя в тексте уведомления', () => {
    renderItem()

    expect(screen.getByText(`Вы предложили обмен ${RECIPIENT_NAME}`)).toBeInTheDocument()
  })

  it('показывает отформатированную дату', () => {
    const notification = createNotification()
    renderItem(notification)

    const formatted = formatDate(notification.createdAt)
    expect(screen.getByText(formatted, { exact: false })).toBeInTheDocument()
  })

  it('показывает кнопку "Перейти" у непрочитанного', () => {
    renderItem({ isRead: false })

    expect(screen.getByRole('button', { name: /^Перейти/ })).toBeInTheDocument()
  })

  it('не показывает кнопку "Перейти" у просмотренного', () => {
    renderItem({ isRead: true })

    expect(screen.queryByRole('button', { name: /^Перейти/ })).not.toBeInTheDocument()
  })

  it('вызывает onGo по клику на "Перейти"', async () => {
    const user = userEvent.setup()
    const { onGo } = renderItem()

    await user.click(screen.getByRole('button', { name: /^Перейти/ }))

    expect(onGo).toHaveBeenCalledTimes(1)
  })

  it('доступное имя кнопки включает текст уведомления', () => {
    renderItem({ isRead: false })

    expect(
      screen.getByRole('button', {
        name: `Перейти — Вы предложили обмен ${RECIPIENT_NAME}`,
      }),
    ).toBeInTheDocument()
  })
})
