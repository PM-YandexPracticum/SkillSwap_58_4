import type { Meta, StoryObj } from '@storybook/react-vite'
import { Loader } from './Loader'

const meta = {
  title: 'shared/ui/Loader',
  component: Loader,
  tags: ['autodocs'],
} satisfies Meta<typeof Loader>

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {}

export const CenteredPage: Story = {
  render: () => (
    <div
      style={{
        display: 'flex',
        minHeight: 320,
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <Loader />
    </div>
  ),
}

export const FeedLoading: Story = {
  render: () => (
    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
      <Loader />
      <span>Загружаем карточки...</span>
    </div>
  ),
}
