import { configureStore } from '@reduxjs/toolkit'
import type { Meta, StoryObj } from '@storybook/react-vite'
import { Provider } from 'react-redux'
import { MemoryRouter } from 'react-router-dom'
import { sessionReducer } from '@/entities/session'
import { usersReducer } from '@/entities/user'
import { ROUTES } from '@/shared/config'
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
    (Story) => {
      const store = configureStore({
        reducer: { users: usersReducer, session: sessionReducer },
      })
      return (
        <Provider store={store}>
          <MemoryRouter initialEntries={[ROUTES.LOGIN]}>
            <div style={{ maxWidth: 1136, margin: '0 auto' }}>
              <Story />
            </div>
          </MemoryRouter>
        </Provider>
      )
    },
  ],
} satisfies Meta<typeof LoginPage>
export default meta
type Story = StoryObj<typeof meta>
export const Default: Story = {}
