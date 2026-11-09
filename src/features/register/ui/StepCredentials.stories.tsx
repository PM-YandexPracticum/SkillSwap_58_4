import type { Meta, StoryObj } from '@storybook/react-vite'
import { MemoryRouter } from 'react-router-dom'
import { userEvent, within } from 'storybook/test'
import { ROUTER_FUTURE } from '@/shared/config'
import { StepCredentials } from './StepCredentials'

const meta = {
  title: 'features/register/StepCredentials',
  component: StepCredentials,
  tags: ['autodocs'],
  args: { onNext: () => undefined },
  parameters: {
    design: {
      type: 'figma',
      url: 'https://www.figma.com/design/40gXmyAoxwwnb9kBxI5B8y/SkillSwap-Red.1-?node-id=1-2548',
    },
  },
  decorators: [
    (Story) => (
      <MemoryRouter future={ROUTER_FUTURE}>
        <div style={{ width: 436 }}>
          <Story />
        </div>
      </MemoryRouter>
    ),
  ],
} satisfies Meta<typeof StepCredentials>
export default meta
type Story = StoryObj<typeof meta>
export const Default: Story = {}
export const Filled: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await userEvent.type(canvas.getByLabelText('Email'), 'petrov@mail.ru')
    await userEvent.type(canvas.getByLabelText('Пароль'), 'password123')
  },
}
export const EmailTaken: Story = {
  play: Filled.play,
  args: { emailError: 'Email уже используется' },
  parameters: {
    design: {
      type: 'figma',
      url: 'https://www.figma.com/design/40gXmyAoxwwnb9kBxI5B8y/SkillSwap-Red.1-?node-id=1-2627',
    },
  },
}
