import type { Meta, StoryObj } from '@storybook/react-vite'
import { ResetFiltersButton } from './ResetFiltersButton'

const meta: Meta<typeof ResetFiltersButton> = {
  title: 'features/catalog-filter/ResetFiltersButton',
  component: ResetFiltersButton,
  tags: ['autodocs'],
}

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    // Передаем пустую функцию, чтобы при клике в консоли или панели Actions было видно, что событие работает
    onClick: () => console.log('Клик по кнопке Сбросить'),
  },
}
