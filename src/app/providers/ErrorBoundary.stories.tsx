import type { Meta, StoryObj } from '@storybook/react-vite';
import { MemoryRouter } from 'react-router-dom';
import { ErrorBoundary } from './ErrorBoundary';

const Bomb = () => {
  throw new Error('Storybook test error');
};

const meta: Meta<typeof ErrorBoundary> = {
  title: 'app/providers/ErrorBoundary',
  component: ErrorBoundary,
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
  },

  decorators: [
    (Story) => (
      <MemoryRouter>
        <Story />
      </MemoryRouter>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Normal: Story = {
  args: {
    children: <div style={{ padding: '20px' }}>Всё работает отлично!</div>,
  },
};

export const WithError: Story = {
  args: {
    children: <Bomb />,
  },
};
