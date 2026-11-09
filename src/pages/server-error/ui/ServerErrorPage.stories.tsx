import type { Meta, StoryObj } from '@storybook/react-vite'
import { MemoryRouter } from 'react-router-dom'

import { ROUTER_FUTURE } from '@/shared/config'

import { ServerErrorPage } from './ServerErrorPage'

/**
 * Страница 500 — внутренняя ошибка сервера.
 * `MemoryRouter` нужен: компонент вызывает `useNavigate()`.
 * `ROUTER_FUTURE` — флаги React Router v7, иначе предупреждения в консоли.
 *
 * @see Figma: «500» (1:2077)
 */
const meta: Meta<typeof ServerErrorPage> = {
  title: 'pages/server-error/ServerErrorPage',
  component: ServerErrorPage,
  tags: ['autodocs'],
  decorators: [
    (Story) => (
      <MemoryRouter future={ROUTER_FUTURE}>
        <Story />
      </MemoryRouter>
    ),
  ],
  parameters: {
    layout: 'fullscreen',
    design: {
      type: 'figma',
      url: 'https://www.figma.com/design/40gXmyAoxwwnb9kBxI5B8y/SkillSwap-Red.1-?node-id=1-2077',
    },
  },
}

export default meta

type Story = StoryObj<typeof meta>

/** Дефолтное состояние — как на макете «500» (1:2077). Других состояний нет. */
export const Default: Story = {}
