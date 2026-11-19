import type { Meta, StoryObj } from '@storybook/react-vite'
import { expect, userEvent, within } from 'storybook/test'

import { ThemeToggle } from './ThemeToggle'

const meta: Meta<typeof ThemeToggle> = {
  title: 'features/theme-toggle/ThemeToggle',
  component: ThemeToggle,
  tags: ['autodocs'],
}

export default meta
type Story = StoryObj<typeof meta>

export const Interactive: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const toggle = canvas.getByRole('button')
    if (toggle.getAttribute('aria-pressed') !== 'true') await userEvent.click(toggle)
    await expect(toggle).toHaveAttribute('aria-pressed', 'true')
  },
}
