import { configureStore } from '@reduxjs/toolkit'
import type { Meta, StoryObj } from '@storybook/react-vite'
import { Provider } from 'react-redux'
import { MemoryRouter } from 'react-router-dom'
import { expect, userEvent, within } from 'storybook/test'

import { searchReducer } from '@/features/skill-search'
import { sessionReducer } from '@/entities/session'
import { usersReducer } from '@/entities/user'
import { createUser } from '@/entities/user/testing'
import { notificationsReducer } from '@/entities/notification'
import { createNotification } from '@/entities/notification/testing'

import { VALIDATION } from '@/shared/config'

import { Header } from './Header'

const account = createUser({ name: 'Мария', avatarUrl: '/images/avatars/u02.jpg' })
const makeStore = (authorized: boolean, hasUnread: boolean, name = account.name) =>
  configureStore({
    reducer: {
      search: searchReducer,
      session: sessionReducer,
      users: usersReducer,
      notifications: notificationsReducer,
    },
    preloadedState: {
      session: { session: authorized ? { userId: account.id, token: 'storybook' } : null },
      users: {
        items: [{ ...account, name }],
        status: 'succeeded' as const,
        error: null,
        saveStatus: 'idle' as const,
        pendingSaves: 0,
        saveError: null,
      },
      notifications: {
        items: hasUnread ? [createNotification({ userId: account.id })] : [],
        status: 'succeeded' as const,
        pendingRequests: 0,
        error: null,
        loadError: null,
      },
    },
  })

const FIGMA_GUEST =
  'https://www.figma.com/design/40gXmyAoxwwnb9kBxI5B8y/SkillSwap-Red.1-?node-id=1-2861'
const FIGMA_LOGGED_IN =
  'https://www.figma.com/design/40gXmyAoxwwnb9kBxI5B8y/SkillSwap-Red.1-?node-id=1-2996'
const FIGMA_BELL_DOT =
  'https://www.figma.com/design/40gXmyAoxwwnb9kBxI5B8y/SkillSwap-Red.1-?node-id=1-1919'

/** Заглушки соседних виджетов: в приложении их передаёт `MainLayout` (P3-05) */
const categoriesMenu = <div style={{ padding: 40 }}>Меню «Все навыки» (заглушка)</div>
const notifications = <div style={{ padding: 40, width: 436 }}>Уведомления (заглушка)</div>

/**
 * Шапка сайта на всю ширину страницы: гость и вошедший пользователь.
 * Вид задаётся состоянием Redux. Внутри `Link`, поэтому stories обёрнуты в `MemoryRouter`.
 * Иконка темы пока без действия (фаза 9).
 */
const meta: Meta<typeof Header> = {
  title: 'widgets/header/Header',
  component: Header,
  tags: ['autodocs'],
  parameters: { layout: 'fullscreen' },
  args: { categoriesMenu },
  decorators: [
    (Story, { parameters }) => (
      <Provider
        store={makeStore(
          Boolean(parameters.authorized),
          Boolean(parameters.hasUnread),
          parameters.userName,
        )}
      >
        <MemoryRouter>
          <Story />
        </MemoryRouter>
      </Provider>
    ),
  ],
}

export default meta

type Story = StoryObj<typeof meta>

/** Гость: «Войти» и «Зарегистрироваться» (1:2861) */
export const Guest: Story = {
  parameters: { design: { type: 'figma', url: FIGMA_GUEST } },
}

export const Authorized: Story = {
  parameters: { authorized: true, design: { type: 'figma', url: FIGMA_LOGGED_IN } },
}

export const AuthorizedWithUnread: Story = {
  parameters: {
    ...Authorized.parameters,
    hasUnread: true,
    design: { type: 'figma', url: FIGMA_BELL_DOT },
  },
}

/** Сохраняем ссылки на ранее опубликованные истории. */
export const LoggedIn: Story = AuthorizedWithUnread
export const LoggedInNoUnread: Story = Authorized

/** Открыто меню «Все навыки» (слот `categoriesMenu`) */
export const CategoriesOpen: Story = {
  parameters: { design: { type: 'figma', url: FIGMA_GUEST } },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await userEvent.click(canvas.getByRole('button', { name: 'Все навыки' }))
    await expect(canvas.getByText('Меню «Все навыки» (заглушка)')).toBeInTheDocument()
  },
}

/** Открыто окно уведомлений (слот `notifications`) */
export const NotificationsOpen: Story = {
  args: { notifications },
  parameters: AuthorizedWithUnread.parameters,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await userEvent.click(canvas.getByRole('button', { name: 'Уведомления, есть новые' }))
    await expect(canvas.getByText('Уведомления (заглушка)')).toBeInTheDocument()
  },
}

/** Открыто меню пользователя: «Личный кабинет» / «Выйти» */
export const MenuOpen: Story = {
  parameters: Authorized.parameters,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await userEvent.click(canvas.getByRole('button', { name: 'Мария' }))
    await expect(canvas.getByRole('link', { name: 'Личный кабинет' })).toBeInTheDocument()
    await expect(canvas.getByRole('button', { name: 'Выйти' })).toBeInTheDocument()
  },
}

export const UserMenuOpen: Story = MenuOpen

/** Краевой случай без отдельного фрейма: максимальная длина имени по схеме регистрации. */
export const LongName: Story = {
  parameters: { ...Authorized.parameters, userName: 'Ш'.repeat(VALIDATION.NAME.MAX) },
}
