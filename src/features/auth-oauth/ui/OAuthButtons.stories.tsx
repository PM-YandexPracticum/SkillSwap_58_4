import type { Meta, StoryObj } from '@storybook/react-vite'

import { OAuthButtons } from './OAuthButtons'

/**
 * «Продолжить с Google / Apple» и разделитель «или» — верх форм входа и регистрации.
 * Заглушки: по клику ничего не происходит.
 */
const meta: Meta<typeof OAuthButtons> = {
  title: 'features/auth-oauth/OAuthButtons',
  component: OAuthButtons,
  tags: ['autodocs'],
  parameters: {
    design: {
      type: 'figma',
      url: 'https://www.figma.com/design/40gXmyAoxwwnb9kBxI5B8y/SkillSwap-Red.1-?node-id=1-2400',
    },
  },
  decorators: [
    (Story) => (
      <div style={{ width: 436 }}>
        <Story />
      </div>
    ),
  ],
}

export default meta

type Story = StoryObj<typeof meta>

/** Единственное состояние из макета */
export const Default: Story = {}
