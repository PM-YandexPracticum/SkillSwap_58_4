import type { Meta, StoryObj } from '@storybook/react-vite'

import { ExchangeStatusBadge } from './ExchangeStatusBadge'

const meta = {
  title: 'entities/exchange/ExchangeStatusBadge',
  component: ExchangeStatusBadge,
  tags: ['autodocs'],
  parameters: {
    design: {
      type: 'figma',
      url: 'https://www.figma.com/design/40gXmyAoxwwnb9kBxI5B8y/SkillSwap-Red.1-?node-id=1-2106',
    },
    docs: {
      description: {
        component:
          'Статичный бейдж собственного предложения обмена по Figma 1:2106. Иконка декоративная, live-региона и дополнительного Tab нет.',
      },
    },
  },
  decorators: [
    (Story) => (
      <div style={{ width: 284 }}>
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof ExchangeStatusBadge>

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {}
