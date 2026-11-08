import type { Meta, StoryObj } from '@storybook/react-vite'

import { CategoryIcon } from './CategoryIcon'

const meta = {
  title: 'entities/category/CategoryIcon',
  component: CategoryIcon,
  tags: ['autodocs'],
  args: { icon: 'business', color: 'business' },
  parameters: {
    design: {
      type: 'figma',
      url: 'https://www.figma.com/design/40gXmyAoxwwnb9kBxI5B8y/SkillSwap-Red.1-?node-id=1-3165',
    },
    docs: {
      description: {
        component:
          'Декоративная SVG 24 px в круге 40 px. Цвет — семантический id категории, берётся из CSS-токенов; не из hex-поля базы.',
      },
    },
  },
} satisfies Meta<typeof CategoryIcon>

export default meta
type Story = StoryObj<typeof meta>

export const Business: Story = {}
export const Creativity: Story = { args: { icon: 'creative', color: 'creativity' } }
export const Languages: Story = { args: { icon: 'languages', color: 'languages' } }
export const Education: Story = { args: { icon: 'education', color: 'education' } }
export const Health: Story = { args: { icon: 'health', color: 'health' } }
export const Home: Story = { args: { icon: 'home', color: 'home' } }
export const Unknown: Story = { args: { icon: 'unknown', color: 'unknown' } }
