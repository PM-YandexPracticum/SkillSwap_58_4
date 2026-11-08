import type { Meta, StoryObj } from '@storybook/react-vite'
import { MemoryRouter } from 'react-router-dom'
import { expect, userEvent, within } from 'storybook/test'

import { ROUTER_FUTURE } from '@/shared/config'

import { Header } from './Header'

import { createAppStore } from '@/app/store'
import { Provider } from 'react-redux'

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
 * Вид переключается пропом `isAuth`. Внутри `Link`, поэтому stories обёрнуты в `MemoryRouter`.
 * Иконка темы пока без действия (фаза 9).
 */
const meta: Meta<typeof Header> = {
  title: 'widgets/header/Header',
  component: Header,
  tags: ['autodocs'],
  parameters: { layout: 'fullscreen' },
  args: { categoriesMenu, notifications },
  decorators: [
    (Story) => (
      <Provider store={createAppStore()}>
        <MemoryRouter future={ROUTER_FUTURE}>
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
  args: { isAuth: false },
  parameters: { design: { type: 'figma', url: FIGMA_GUEST } },
}

/** Вошедший: колокольчик с красной точкой, сердечко, имя и аватар (1:2996) */
export const LoggedIn: Story = {
  args: { isAuth: true, userName: 'Мария', userAvatar: '/images/avatars/u02.jpg', hasUnread: true },
  parameters: { design: { type: 'figma', url: FIGMA_LOGGED_IN } },
}

/** Вошедший, новых уведомлений нет: колокольчик без точки (точка — 1:1919) */
export const LoggedInNoUnread: Story = {
  args: { ...LoggedIn.args, hasUnread: false },
  parameters: { design: { type: 'figma', url: FIGMA_BELL_DOT } },
}

/** Открыто меню «Все навыки» (слот `categoriesMenu`) */
export const CategoriesOpen: Story = {
  args: { isAuth: false },
  parameters: { design: { type: 'figma', url: FIGMA_GUEST } },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await userEvent.click(canvas.getByRole('button', { name: 'Все навыки' }))
    await expect(canvas.getByText('Меню «Все навыки» (заглушка)')).toBeInTheDocument()
  },
}

/** Открыто окно уведомлений (слот `notifications`) */
export const NotificationsOpen: Story = {
  args: LoggedIn.args,
  parameters: { design: { type: 'figma', url: FIGMA_LOGGED_IN } },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await userEvent.click(canvas.getByRole('button', { name: 'Уведомления, есть новые' }))
    await expect(canvas.getByText('Уведомления (заглушка)')).toBeInTheDocument()
  },
}

/** Открыто меню пользователя: «Личный кабинет» / «Выйти» */
export const UserMenuOpen: Story = {
  args: LoggedIn.args,
  parameters: { design: { type: 'figma', url: FIGMA_LOGGED_IN } },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await userEvent.click(canvas.getByRole('button', { name: 'Мария' }))
    await expect(canvas.getByRole('link', { name: 'Личный кабинет' })).toBeInTheDocument()
    await expect(canvas.getByRole('button', { name: 'Выйти' })).toBeInTheDocument()
  },
}
