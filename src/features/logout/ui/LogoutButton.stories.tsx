import { configureStore } from '@reduxjs/toolkit'
import type { Meta, StoryObj } from '@storybook/react-vite'
import { Provider } from 'react-redux'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import { sessionReducer } from '@/entities/session'
import { ROUTES } from '@/shared/config'
import { LogoutButton } from './LogoutButton'

const meta: Meta<typeof LogoutButton> = {
  title: 'features/logout/LogoutButton',
  component: LogoutButton,
  decorators: [
    (Story) => {
      const store = configureStore({
        reducer: { session: sessionReducer },
        preloadedState: { session: { session: { userId: 'u-test', token: 'storybook' } } },
      })
      return (
        <Provider store={store}>
          <MemoryRouter initialEntries={[ROUTES.PROFILE]}>
            <Routes>
              <Route path={ROUTES.PROFILE} element={<Story />} />
              <Route path={ROUTES.HOME} element={<p>Вы вышли из аккаунта</p>} />
            </Routes>
          </MemoryRouter>
        </Provider>
      )
    },
  ],
}

export default meta
export const Default: StoryObj<typeof meta> = {}
