import type { Meta, StoryObj } from '@storybook/react-vite'

import { createSkill } from '@/entities/skill/testing'

import { SkillGallery } from './SkillGallery'

const skill = createSkill({
  title: 'Игра на барабанах',
  images: [
    '/images/skills/s01-1.jpg',
    '/images/skills/s01-2.jpg',
    '/images/skills/s01-3.jpg',
    '/images/skills/s01-4.jpg',
  ],
})

const meta: Meta<typeof SkillGallery> = {
  title: 'entities/skill/SkillGallery',
  component: SkillGallery,
  tags: ['autodocs'],
  parameters: {
    design: {
      type: 'figma',
      url: 'https://www.figma.com/design/40gXmyAoxwwnb9kBxI5B8y/SkillSwap-Red.1-?node-id=1-1799',
    },
    docs: {
      description: {
        component: 'Общая галерея страницы навыка (Figma 1:2764) и превью регистрации (1:1799).',
      },
    },
  },
  args: { title: skill.title, images: skill.images },
}
export default meta

type Story = StoryObj<typeof meta>
export const Default: Story = {}
export const SingleImage: Story = { args: { images: skill.images.slice(0, 1) } }
export const NoImages: Story = { args: { images: [] } }
