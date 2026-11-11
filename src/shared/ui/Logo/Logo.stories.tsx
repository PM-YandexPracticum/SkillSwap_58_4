import type { Meta, StoryObj } from '@storybook/react-vite'
import { MemoryRouter } from 'react-router-dom'

import { Logo } from './Logo'

/**
 * Логотип из шапки сайта (1:2870).
 * Внутри `Link`, поэтому stories обёрнуты в `MemoryRouter`.
 */
const meta = {
  title: 'shared/ui/Logo',
  component: Logo,
  tags: ['autodocs'],
  decorators: [
    (Story) => (
      <MemoryRouter>
        <Story />
      </MemoryRouter>
    ),
  ],
} satisfies Meta<typeof Logo>

export default meta

type Story = StoryObj<typeof meta>

/** Иконка и текст — как в шапке (1:2870) */
export const Default: Story = {
  args: { withText: true },
}

/** Только иконка — у ссылки остаётся подпись для скринридера */
export const IconOnly: Story = {
  args: { withText: false },
}
