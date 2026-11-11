import type { Meta, StoryObj } from '@storybook/react-vite'
import { MemoryRouter } from 'react-router-dom'
import { LoginPage } from './LoginPage'

const meta = {
  title: 'pages/login/LoginPage',
  component: LoginPage,
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
    design: {
      type: 'figma',
      url: 'https://www.figma.com/design/40gXmyAoxwwnb9kBxI5B8y/SkillSwap-Red.1-?node-id=1-2400',
    },
  },
  decorators: [
    (Story) => (
      <MemoryRouter>
        <div style={{ maxWidth: 1136, margin: '0 auto' }}>
          <Story />
        </div>
      </MemoryRouter>
    ),
  ],
} satisfies Meta<typeof LoginPage>
export default meta
type Story = StoryObj<typeof meta>
export const Default: Story = {}
