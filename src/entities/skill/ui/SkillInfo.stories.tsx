import type { Meta, StoryObj } from '@storybook/react-vite'

import type { Skill } from '../model/types'
import { createSkill } from '@/entities/skill/testing'
import { SkillInfo, type SkillInfoProps } from './SkillInfo'
import { IconButton } from '@/shared/ui/IconButton'
import LikeIcon from '@/shared/assets/icons/like.svg?react'
import LikeFilledIcon from '@/shared/assets/icons/like-filled.svg?react'
import ShareIcon from '@/shared/assets/icons/share.svg?react'
import MoreIcon from '@/shared/assets/icons/more-square.svg?react'
import ClockIcon from '@/shared/assets/icons/clock.svg?react'
import { Button } from '@/shared/ui/Button'

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

export const Default: Story = {
  args: {
    actions: {
      like: <IconButton ariaLabel='Добавить в избранное' onClick={() => {}} icon=<LikeIcon />/>,
      createOffer: <Button onClick={() => {}}>Предложить обмен</Button>,
      share: <IconButton ariaLabel='Поделиться' icon=<ShareIcon />/>,
      more: <IconButton ariaLabel='Больше опций' icon=<MoreIcon />/>,
    }
  }
}

export const Liked: Story = {
  args: {
    actions: {
      like: <IconButton ariaLabel='Убрать из избранного' onClick={() => {}} icon=<LikeFilledIcon style={{color: 'var(--color-accent)'}}/>/>,
      createOffer: <Button onClick={() => {}}>Предложить обмен</Button>,
      share: <IconButton ariaLabel='Поделиться' icon=<ShareIcon />/>,
      more: <IconButton ariaLabel='Больше опций' icon=<MoreIcon />/>,
    }
  }
}

export const CreatedOffer: Story = {
  args: {
    actions: {
      like: <IconButton ariaLabel='Убрать из избранного' onClick={() => {}} icon=<LikeFilledIcon style={{color: 'var(--color-accent)'}}/>/>,
      createOffer: <Button variant='secondary' onClick={() => {}}>< ClockIcon width={20} height={20}/>Обмен предложен</Button>,
      share: <IconButton ariaLabel='Поделиться' icon=<ShareIcon />/>,
      more: <IconButton ariaLabel='Больше опций' icon=<MoreIcon />/>,
    }
  }
}
