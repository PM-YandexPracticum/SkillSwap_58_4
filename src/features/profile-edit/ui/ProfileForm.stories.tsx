import type { Meta, StoryObj } from '@storybook/react-vite'
import { Provider } from 'react-redux'
import { configureStore } from '@reduxjs/toolkit'
import { citiesReducer } from '@/entities/city'
import { getUserById } from '@/entities/user'
import { ProfileForm } from './ProfileForm'

const meta: Meta<typeof ProfileForm> = {
  title: 'features/profile-edit/ProfileForm',
  component: ProfileForm,
  tags: ['autodocs'],
  loaders: [async () => ({ profile: await getUserById('u01') })],
  parameters: {
    layout: 'centered',
    design: {
      type: 'figma',
      url: 'https://www.figma.com/design/40gXmyAoxwwnb9kBxI5B8y/SkillSwap-Red.1-?node-id=1-2370',
    },
    docs: {
      description: {
        component:
          'Форма личных данных с общей Yup-валидацией. Начальные данные загружаются из учебной базы. Полный редактор с аватаром — в pages/profile/ProfilePersonal.',
      },
    },
  },
  decorators: [
    (Story, context) => {
      const store = configureStore({
        reducer: { cities: citiesReducer },
        preloadedState: {
          cities: { items: [{ id: 'spb', name: 'Санкт-Петербург' }], status: 'succeeded' as const },
        },
      })
      return (
        <Provider store={store}>
          <Story args={{ user: context.loaded.profile }} />
        </Provider>
      )
    },
  ],
}
export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}
