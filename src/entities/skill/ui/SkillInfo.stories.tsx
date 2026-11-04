import type { Meta, StoryObj } from '@storybook/react-vite'

import type { Skill } from '../model/types'
import { createSkill } from '@/entities/skill/testing'
import { SkillInfo, type SkillInfoProps } from './SkillInfo'

const CATEGORY = {
  creativity: {
    id: 'creativity',
    title: 'Творчество и искусство',
  },
}

const SUBCATEGORY = {
  music: { id: 'music', categoryId: 'creativity', title: 'Музыка и звук' },
}

const skill: Skill = createSkill({
  title: 'Игра на барабанах',
  description:
    'Привет! Я играю на барабанах уже больше 10 лет — от репетиций в гараже до выступлений на сцене с живыми группами. Научу основам техники (и как не отбить себе пальцы), играть любимые ритмы и разбирать песни, импровизировать и звучать уверенно даже без паритуры',
  categoryId: 'creativity',
  subcategoryId: 'music',
  images: [
    '/images/skills/s01-1.jpg',
    '/images/skills/s01-2.jpg',
    '/images/skills/s01-3.jpg',
    '/images/skills/s01-4.jpg',
  ],
})

const skillArg: SkillInfoProps['skill'] = {
  title: skill.title,
  description: skill.description,
  images: skill.images
}
const categoryTitleArg: SkillInfoProps['categoryTitle'] = CATEGORY.creativity.title
const subcategoryTitleArg: SkillInfoProps['subcategoryTitle'] = SUBCATEGORY.music.title

const meta: Meta<typeof SkillInfo> = {
  title: 'entities/skill/SkillInfo',
  component: SkillInfo,
  tags: ['autodocs'],
  args: {
    skill: skillArg,
    categoryTitle: categoryTitleArg,
    subcategoryTitle: subcategoryTitleArg,
  },
}
export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {}
