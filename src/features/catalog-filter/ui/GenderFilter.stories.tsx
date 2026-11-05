import type { Meta, StoryObj } from '@storybook/react-vite'
import { GenderFilter } from './GenderFilter'

const meta: Meta<typeof GenderFilter> = {
  title: 'features/catalog-filter/GenderFilter',
  component: GenderFilter,
  tags: ['autodocs'],
}

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {},
}
