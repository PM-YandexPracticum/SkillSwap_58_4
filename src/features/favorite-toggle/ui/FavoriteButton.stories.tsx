import type { Meta, StoryObj } from '@storybook/react-vite'

import { FavoriteButton } from './FavoriteButton'

const meta = {
  title: 'features/favorite-toggle/FavoriteButton',
  component: FavoriteButton,
  tags: ['autodocs'],
  args: { userId: 'u01', likesCount: 10 },
  parameters: {
    design: {
      type: 'figma',
      url: 'https://www.figma.com/design/40gXmyAoxwwnb9kBxI5B8y/SkillSwap-Red.1-?node-id=1-2877',
    },
    docs: {
      description: {
        component:
          'В P3-08 только внешний вид: сердечко и число, клик ничего не меняет. Счётчик добавлен по ТЗ, в Figma его нет. Состояния «уже лайкнул» и сохранение относятся к P5-07.',
      },
    },
  },
} satisfies Meta<typeof FavoriteButton>

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {}
export const Zero: Story = { args: { likesCount: 0 } }
export const LargeCount: Story = { args: { likesCount: 12345 } }
