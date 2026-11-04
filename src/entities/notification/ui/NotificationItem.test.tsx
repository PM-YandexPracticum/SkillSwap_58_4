import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

import { createNotification } from '../testing'
import { NotificationItem } from './NotificationItem'
import type { Notification } from '../model/types'

/** Готовая для фразы форма имени — компонент не склоняет. */
const RECIPIENT_NAME = 'Ивану'

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
    renderItem()

    expect(screen.getByText('15 января')).toBeInTheDocument()
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
