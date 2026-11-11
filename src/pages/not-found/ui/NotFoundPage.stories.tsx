import type { Meta, StoryObj } from '@storybook/react-vite'
import { MemoryRouter } from 'react-router-dom'

import { NotFoundPage } from './NotFoundPage'

/**
 * Страница 404 — любой неизвестный адрес.
 * `MemoryRouter` нужен: компонент вызывает `useNavigate()`.
 *
 * @see Figma: «404» (1:2048)
 */
const meta: Meta<typeof NotFoundPage> = {
  title: 'pages/not-found/NotFoundPage',
  component: NotFoundPage,
  tags: ['autodocs'],
  decorators: [
    (Story) => (
      <MemoryRouter>
        <Story />
      </MemoryRouter>
    ),
  ],
  parameters: {
    layout: 'fullscreen',
    design: {
      type: 'figma',
      url: 'https://www.figma.com/design/40gXmyAoxwwnb9kBxI5B8y/SkillSwap-Red.1-?node-id=1-2048',
    },
  },
}

export default meta

type Story = StoryObj<typeof meta>

/** Дефолтное состояние — как на макете «404» (1:2048). Других состояний нет. */
export const Default: Story = {}
