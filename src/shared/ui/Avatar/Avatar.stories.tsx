import type { Meta, StoryObj } from '@storybook/react-vite'

import { Avatar } from './Avatar'

/**
 * Размеры и внешний вид — по макету SkillSwap.
 * `sm` — шапка (1:2996), `md` — карточка каталога (1:2861), `lg` — профиль (1:2370).
 */
const meta: Meta<typeof Avatar> = {
  title: 'shared/ui/Avatar',
  component: Avatar,
  tags: ['autodocs'],
}

export default meta

type Story = StoryObj<typeof meta>

/** Базовое состояние — размер `md` с фото. Карточка каталога (1:2861). */
export const Default: Story = {
  args: { src: '/images/avatars/u01.jpg', alt: 'Иван', size: 'md' },
}

/** Маленький аватар — шапка (1:2996). */
export const Small: Story = {
  args: { src: '/images/avatars/u01.jpg', alt: 'Иван', size: 'sm' },
}

/** Большой аватар — профиль, личные данные (1:2370). */
export const Large: Story = {
  args: { src: '/images/avatars/u02.jpg', alt: 'Мария', size: 'lg' },
}

/** Без фото — `resolveImageUrl` подставляет заглушку `IMAGE_PLACEHOLDERS.AVATAR`. */
export const NoPhoto: Story = {
  args: { src: null, alt: 'Пользователь без фото', size: 'md' },
}
