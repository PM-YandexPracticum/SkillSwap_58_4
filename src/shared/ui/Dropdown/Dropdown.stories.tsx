import type { Meta, StoryObj } from '@storybook/react-vite'
import { cloneElement, useEffect, useState, type ReactElement } from 'react'
import { fn } from 'storybook/test'

import { Dropdown } from './Dropdown'

/**
 * Поповер под кнопкой шапки.
 *
 * Сам Dropdown не знает о содержимом.
 * Закрытие: Esc и клик мимо.
 *
 * В stories состояние живое: кнопка открывает и закрывает поповер,
 * Esc и клик мимо закрывают, вызов `onClose` виден во вкладке Actions.
 */
const meta: Meta<typeof Dropdown> = {
  title: 'shared/ui/Dropdown',
  component: Dropdown,
  tags: ['autodocs'],
  args: {
    onClose: fn(),
  },
  render: function Render(args) {
    const [isOpen, setIsOpen] = useState(args.isOpen)

    // переключатель isOpen во вкладке Controls тоже работает
    useEffect(() => setIsOpen(args.isOpen), [args.isOpen])

    const trigger = cloneElement(args.trigger as ReactElement<{ onClick?: () => void }>, {
      onClick: () => setIsOpen((open) => !open),
    })

    const handleClose = () => {
      args.onClose()
      setIsOpen(false)
    }

    return <Dropdown {...args} trigger={trigger} isOpen={isOpen} onClose={handleClose} />
  },
}

export default meta

type Story = StoryObj<typeof meta>

/** Открыто меню "Все навыки" (1:1415) */
export const SkillsMenu: Story = {
  args: {
    isOpen: true,
    trigger: <button type="button">Все навыки</button>,
    children: (
      <ul style={{ padding: 60, listStyle: 'none' }}>
        <li>Навык 1</li>
        <li>Навык 2</li>
        <li>Навык 3</li>
      </ul>
    ),
  },
}

/** Открыто меню уведомлений (1:2190) */
export const Notifications: Story = {
  args: {
    isOpen: true,
    trigger: <button type="button">🔔</button>,
    align: 'end',
    children: <div style={{ padding: 60, width: 436 }}>Новых уведомлений нет</div>,
  },
}

/** Открыто меню пользователя (1:2323) */
export const UserMenu: Story = {
  args: {
    isOpen: true,
    trigger: <button type="button">Иван</button>,
    align: 'end',
    children: (
      <ul style={{ padding: 40, listStyle: 'none' }}>
        <li>Личный кабинет</li>
        <li>Выйти</li>
      </ul>
    ),
  },
}

/** Закрытое состояние - триггер без поповера */
export const Closed: Story = {
  args: {
    isOpen: false,
    trigger: <button type="button">Все навыки</button>,
    children: <p>Меню</p>,
  },
}
