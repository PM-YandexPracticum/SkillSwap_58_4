import { IconButton } from './IconButton'
import type { Meta, StoryObj } from '@storybook/react-vite'
import LikeIcon from '../../assets/icons/like.svg?react'
import LikeFilledIcon from '../../assets/icons/like-filled.svg?react'
import NotificationIcon from '../../assets/icons/notification.svg?react'
import CrossIcon from '../../assets/icons/cross.svg?react'
const meta = {
  title: 'shared/ui/IconButton',
  component: IconButton,
  tags: ['autodocs'],
} satisfies Meta<typeof IconButton>

export default meta

type Story = StoryObj<typeof meta>

/** Состояния лайка и уведомлений
 * @see Figma: 1:2765 — шапка: лайк, колокольчик
 */
export const Like: Story = {
  args: { ariaLabel: 'Добавить в избранное', icon: <LikeIcon /> },
}

export const Liked: Story = {
  args: {
    ariaLabel: 'Убрать из избранного',
    icon: <LikeFilledIcon style={{ color: 'var(--color-accent)' }} />,
  },
}
export const Notification: Story = {
  args: {
    ariaLabel: 'Уведомления',
    icon: <NotificationIcon />,
  },
}

/** Закрытие
 * @see Figma: 1:15143 — шапка: закрыть
 */
export const Close: Story = {
  args: {
    ariaLabel: 'Закрыть',
    icon: <CrossIcon />,
  },
}
