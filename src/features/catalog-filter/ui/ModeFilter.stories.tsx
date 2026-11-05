import type { Meta, StoryObj } from '@storybook/react-vite'
import { ModeFilter } from './ModeFilter'

const meta: Meta<typeof ModeFilter> = {
  title: 'features/catalog-filter/ModeFilter',
  component: ModeFilter,
  tags: ['autodocs'],
}

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {},
}
