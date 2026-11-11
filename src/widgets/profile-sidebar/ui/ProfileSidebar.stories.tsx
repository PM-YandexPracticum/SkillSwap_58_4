import type { Meta, StoryObj } from '@storybook/react-vite';
import { MemoryRouter } from 'react-router-dom';
import { ProfileSidebar } from './ProfileSidebar';

const meta: Meta<typeof ProfileSidebar> = {
  title: 'widgets/profile-sidebar/ProfileSidebar',
  component: ProfileSidebar,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
    design: {
      type: 'figma',
      url: 'https://www.figma.com/design/40gXmyAoxwwnb9kBxI5B8y/SkillSwap-Red.1-?node-id=1-2370',
    },
  },
  decorators: [
    (Story) => (
      <MemoryRouter initialEntries={['/profile']}>
        <div style={{ width: 280 }}>
          <Story />
        </div>
      </MemoryRouter>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
