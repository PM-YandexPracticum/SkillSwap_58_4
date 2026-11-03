import type { Meta, StoryObj } from '@storybook/react-vite'
import { MemoryRouter } from 'react-router-dom'

import { Footer } from './Footer'

/**
 * Подвал на всю ширину страницы — как внизу каталога (1:2861).
 * Логотип и ссылки внутри — `Link`, поэтому stories обёрнуты в `MemoryRouter`.
 */
const meta = {
  title: 'widgets/footer/Footer',
  component: Footer,
  tags: ['autodocs'],
  parameters: { layout: 'fullscreen' },
  decorators: [
    (Story) => (
      <MemoryRouter>
        <Story />
      </MemoryRouter>
    ),
  ],
} satisfies Meta<typeof Footer>

export default meta

type Story = StoryObj<typeof meta>

/**
 * Единственное состояние из макета. «О проекте» и «Все навыки» — рабочие ссылки
 * (наведение и фокус с клавиатуры подсвечивают их), остальные пункты — заглушки.
 */
export const Default: Story = {}
