import type { Meta, StoryObj } from '@storybook/react-vite'
import { fn } from 'storybook/test'
import { EmptyState } from './EmptyState'

const meta = {
  title: 'Shared/UI/EmptyState',
  component: EmptyState,
  tags: ['autodocs'],
  parameters: { layout: 'centered' },
} satisfies Meta<typeof EmptyState>

export default meta
type Story = StoryObj<typeof meta>

export const Search: Story = {
  args: {
    title: 'Ничего не найдено',
    description: 'Попробуйте изменить параметры поиска или сбросить фильтры',
    action: { label: 'Сбросить фильтры', onClick: fn() },
  },
}

export const Favorites: Story = {
  args: {
    title: 'Список избранного пуст',
    description: 'Добавьте предложения, чтобы они появились здесь',
    action: { label: 'Перейти в каталог', onClick: fn() },
  },
}

export const Notifications: Story = {
  args: {
    title: 'Уведомлений пока нет',
    description: 'Здесь будут появляться ответы на ваши предложения',
  },
}

export const WithIcon: Story = {
  args: {
    title: 'Ничего не найдено',
    description: 'Попробуйте изменить параметры поиска',
    icon: (
      <svg
        width="48"
        height="48"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
      >
        <circle cx="11" cy="11" r="7" />
        <path d="m20 20-3.5-3.5" strokeLinecap="round" />
      </svg>
    ),
    action: { label: 'Сбросить фильтры', onClick: fn() },
  },
}
