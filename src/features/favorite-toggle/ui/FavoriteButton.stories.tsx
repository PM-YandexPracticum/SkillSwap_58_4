import { ToastContext } from '@/shared/lib/toast'
import { configureStore } from '@reduxjs/toolkit'
import { Provider } from 'react-redux'
import { MemoryRouter } from 'react-router-dom'
import { fetchUsers, usersReducer } from '@/entities/user'
import { sessionReducer } from '@/entities/session'
import { createUser } from '@/entities/user/testing'
import { favoriteToggleReducer } from '../model/favoriteToggleSlice'
import type { Meta, StoryObj } from '@storybook/react-vite'

import { FavoriteButton } from './FavoriteButton'

const meta = {
  title: 'features/favorite-toggle/FavoriteButton',
  component: FavoriteButton,
  tags: ['autodocs'],
  args: { userId: 'u01', likesCount: 10 },
  decorators: [
    (Story, { args, parameters }) => {
      const owner = createUser({ id: 'u02', likedUserIds: parameters.liked ? [args.userId] : [] })
      const target = createUser({ id: args.userId, likesCount: args.likesCount })
      const store = configureStore({
        reducer: {
          users: usersReducer,
          session: sessionReducer,
          favoriteToggle: favoriteToggleReducer,
        },
        preloadedState: {
          session: { session: parameters.authorized ? { userId: owner.id, token: 'story' } : null },
          favoriteToggle: { pendingUserIds: parameters.pending ? [args.userId] : [] },
        },
      })
      store.dispatch(
        fetchUsers.fulfilled(target.id === owner.id ? [owner] : [target, owner], 'story'),
      )
      return (
        <Provider store={store}>
          <ToastContext.Provider value={{ showToast: () => {}, removeToast: () => {} }}>
            <MemoryRouter>
              <Story />
            </MemoryRouter>
          </ToastContext.Provider>
        </Provider>
      )
    },
  ],
  parameters: {
    design: {
      type: 'figma',
      url: 'https://www.figma.com/design/40gXmyAoxwwnb9kBxI5B8y/SkillSwap-Red.1-?node-id=1-2877',
    },
    docs: {
      description: {
        component:
          'P5-07: гость, выбранное сердечко, ожидание сохранения и собственная карточка. Счётчик добавлен по ТЗ, в Figma его нет. Stories показывают подготовленные состояния; в приложении родитель передаёт обновлённый счётчик из store.',
      },
    },
  },
} satisfies Meta<typeof FavoriteButton>

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {}
export const Zero: Story = { args: { likesCount: 0 } }
export const LargeCount: Story = { args: { likesCount: 12345 } }

export const Liked: Story = { parameters: { authorized: true, liked: true } }
export const Saving: Story = { parameters: { authorized: true, pending: true } }
export const OwnCard: Story = { args: { userId: 'u02' }, parameters: { authorized: true } }
