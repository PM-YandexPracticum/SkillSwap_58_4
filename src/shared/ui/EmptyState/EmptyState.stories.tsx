import type { Meta, StoryObj } from '@storybook/react-vite'
import { expect, fn, userEvent, within } from 'storybook/test'
import SearchIcon from '@/shared/assets/icons/search.svg?react'
import { EmptyState } from './EmptyState'

/**
 * Пустые списки не нарисованы отдельно: оформление — по токенам проекта (P8-03).
 * Родитель выбирает сообщение и действие; загрузка и ошибки показаны в stories потребителей.
 */
const meta = {
  title: 'shared/ui/EmptyState',
  component: EmptyState,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'Общий блок пустого списка без загрузки и бизнес-логики. Пустые состояния в макете не нарисованы; контекст: [каталог](https://www.figma.com/design/40gXmyAoxwwnb9kBxI5B8y/SkillSwap-Red.1-?node-id=1-2860) и [уведомления](https://www.figma.com/design/40gXmyAoxwwnb9kBxI5B8y/SkillSwap-Red.1-?node-id=1-2190).',
      },
    },
    design: {
      type: 'figma',
      url: 'https://www.figma.com/design/40gXmyAoxwwnb9kBxI5B8y/SkillSwap-Red.1-?node-id=1-2860',
    },
  },
} satisfies Meta<typeof EmptyState>

export default meta
type Story = StoryObj<typeof meta>

export const NoOffers: Story = {
  args: {
    title: 'Предложения пока не добавлены',
    description: 'Загляните позже — здесь появятся новые обмены',
  },
}

export const Search: Story = {
  args: {
    title: 'Ничего не нашлось',
    description: 'Попробуйте изменить параметры поиска или сбросить фильтры',
    action: { label: 'Сбросить поиск и фильтры', onClick: fn() },
  },
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement)
    await userEvent.click(canvas.getByRole('button', { name: 'Сбросить поиск и фильтры' }))
    await expect(args.action?.onClick).toHaveBeenCalledOnce()
  },
}

export const Favorites: Story = {
  args: {
    title: 'В избранном пока нет предложений',
    action: { label: 'Вернуться в каталог', onClick: fn() },
  },
}

export const FilteredFavorites: Story = {
  args: {
    title: 'По выбранным фильтрам ничего не найдено',
    action: { label: 'Сбросить поиск и фильтры', onClick: fn() },
  },
}

export const Notifications: Story = {
  args: {
    title: 'Уведомлений пока нет',
    compact: true,
  },
  parameters: {
    design: {
      type: 'figma',
      url: 'https://www.figma.com/design/40gXmyAoxwwnb9kBxI5B8y/SkillSwap-Red.1-?node-id=1-2190',
    },
  },
}

export const WithIcon: Story = {
  args: {
    ...Search.args,
    icon: <SearchIcon width={48} height={48} />,
  },
}
