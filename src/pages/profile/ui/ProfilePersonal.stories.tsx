import type { Meta, StoryObj } from '@storybook/react-vite'
import { Provider } from 'react-redux'
import { configureStore } from '@reduxjs/toolkit'
import { citiesReducer } from '@/entities/city'
import { sessionReducer } from '@/entities/session'
import { usersReducer, getUserById } from '@/entities/user'
import { ProfilePersonal } from './ProfilePersonal'

const meta = {
  title: 'pages/profile/ProfilePersonal',
  component: ProfilePersonal,
  tags: ['autodocs'],
  loaders: [async () => ({ profile: await getUserById('u01') })],
  parameters: {
    layout: 'padded',
    design: {
      type: 'figma',
      url: 'https://www.figma.com/design/40gXmyAoxwwnb9kBxI5B8y/SkillSwap-Red.1-?node-id=1-2370',
    },
    docs: {
      description: {
        component:
          'Личные данные и фото в одной форме. Начальные данные и изменения хранятся в учебной базе браузера Storybook, отдельно от приложения.',
      },
    },
  },
  decorators: [
    (Story, context) => {
      const currentUser = context.loaded.profile
      const store = configureStore({
        reducer: { cities: citiesReducer, users: usersReducer, session: sessionReducer },
        preloadedState: {
          cities: { items: [{ id: 'spb', name: 'Санкт-Петербург' }], status: 'succeeded' as const },
          users: {
            items: [currentUser],
            status: 'succeeded' as const,
            error: null,
            saveStatus: 'idle' as const,
            pendingSaves: 0,
            saveError: null,
          },
          session: { session: { userId: currentUser.id, token: 'storybook' } },
        },
      })
      return (
        <Provider store={store}>
          <div style={{ width: 900, padding: 60 }}>
            <Story />
          </div>
        </Provider>
      )
    },
  ],
} satisfies Meta<typeof ProfilePersonal>
export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}
