import { Button } from './Button'
import type { Meta, StoryObj } from '@storybook/react-vite'

const meta = {
  title: 'shared/ui/Button',
  component: Button,
  tags: ['autodocs'],
} satisfies Meta<typeof Button>

export default meta

type Story = StoryObj<typeof meta>

/** Базовое состояние
 * @see Figma 1:2871 кнопки "Подробнее", "Войти", "Смотреть все"
 */
export const Primary: Story = {
  args: { variant: 'primary', children: 'Подробнее' },
}

export const Secondary: Story = {
  args: { variant: 'secondary', children: 'Войти' },
}

export const Ghost: Story = {
  args: { variant: 'ghost', children: 'Смотреть все' },
}

export const Disabled: Story = {
  args: { variant: 'primary', children: 'Подробнее', disabled: true },
}
