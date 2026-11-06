import type { Meta, StoryObj } from '@storybook/react-vite'
import { UserProfileCard } from './UserProfileCard'
import { createUser } from '../testing'
import { UserCardTag } from './UserCard'

const user = createUser({
  name: 'Иван',
  cityId: 'spb',
  birthDate: '1992-03-15T10:00:00.000Z',
  avatarUrl: '/images/avatars/u01.jpg',
  about: 'Привет! Люблю ритм, кофе по утрам и людей, которые не боятся пробовать новое',
})

const SUBCATEGORIES = {
  timeManagement: { id: 'time-management', title: 'Тайм-менеджмент', categoryId: 'business' },
  english: { id: 'english', title: 'Английский', categoryId: 'languages' },
  photo: { id: 'photo', title: 'Фотография', categoryId: 'creativity' },
  yoga: { id: 'yoga', title: 'Йога и медитация', categoryId: 'health' },
  drawing: { id: 'drawing', title: 'Рисование и иллюстрация', categoryId: 'creativity' },
  creativeWriting: { id: 'creative-writing', title: 'Креативное письмо', categoryId: 'creativity' },
} as const

const CITY = {
  id: 'spb',
  name: 'Санкт-Петербург',
}

const teachSkillArg: UserCardTag = {
  title: 'Игра на барабанах',
  categoryId: 'creativity'
}

const learnSubcategoriesArg = [
  SUBCATEGORIES.timeManagement,
  SUBCATEGORIES.yoga,
]

const meta: Meta<typeof UserProfileCard> = {
  title: 'entities/user/UserProfileCard',
  component: UserProfileCard,
  tags: ['autodocs'],
  args: {
    user,
    cityName: CITY.name,
    teachSkill: teachSkillArg,
    learnSubcategories: learnSubcategoriesArg,
  }
}
export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {}

export const ManyLearningTags: Story = {
  args: {
    learnSubcategories: [SUBCATEGORIES.timeManagement, SUBCATEGORIES.english, SUBCATEGORIES.photo, SUBCATEGORIES.yoga]
  }
}
