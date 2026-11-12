import { configureStore } from '@reduxjs/toolkit'
import type { Meta, StoryObj } from '@storybook/react-vite'
import { Provider } from 'react-redux'
import { MemoryRouter } from 'react-router-dom'

import { categoriesReducer, type Category } from '@/entities/category'
import { citiesReducer } from '@/entities/city'
import { exchangesReducer } from '@/entities/exchange'
import { sessionReducer } from '@/entities/session'
import { skillsReducer } from '@/entities/skill'
import { createSkill } from '@/entities/skill/testing'
import { createUser } from '@/entities/user/testing'

import { OfferCard } from './OfferCard'

const author = createUser({
  avatarUrl: '/images/avatars/u01.jpg',
  learnSubcategoryIds: ['time-management', 'yoga', 'english', 'photography'],
})

const categories: Category[] = [
  {
    id: 'business',
    title: 'Бизнес и карьера',
    icon: 'business',
    color: 'business',
    subcategories: [{ id: 'time-management', categoryId: 'business', title: 'Тайм-менеджмент' }],
  },
  {
    id: 'health',
    title: 'Здоровье и лайфстайл',
    icon: 'health',
    color: 'health',
    subcategories: [{ id: 'yoga', categoryId: 'health', title: 'Медитация' }],
  },
  {
    id: 'languages',
    title: 'Иностранные языки',
    icon: 'languages',
    color: 'languages',
    subcategories: [{ id: 'english', categoryId: 'languages', title: 'Английский' }],
  },
  {
    id: 'creativity',
    title: 'Творчество и искусство',
    icon: 'creativity',
    color: 'creativity',
    subcategories: [{ id: 'photography', categoryId: 'creativity', title: 'Фотография' }],
  },
]

const meta = {
  title: 'widgets/offer-card/OfferCard',
  component: OfferCard,
  tags: ['autodocs'],
  args: { user: author },
  parameters: {
    layout: 'centered',
    design: {
      type: 'figma',
      url: 'https://www.figma.com/design/40gXmyAoxwwnb9kBxI5B8y/SkillSwap-Red.1-?node-id=1-2877',
    },
    docs: {
      description: {
        component:
          'P3-08 / P7-04: данные из preloadedState, без запросов и сохранения. Гость и вошедший без исходящего предложения видят ссылку; собственное предложение заменяет её статусом. Счётчик рядом с сердечком добавлен по ТЗ — в Figma есть только иконка. «Подробнее» — ссылка; обработка лайка появится в P5-07. Размер карточки из макета — 324 × 368 px.',
      },
    },
  },
  decorators: [
    (Story, { args, parameters }) => {
      const store = configureStore({
        reducer: {
          cities: citiesReducer,
          categories: categoriesReducer,
          skills: skillsReducer,
          session: sessionReducer,
          exchanges: exchangesReducer,
        },
        preloadedState: {
          cities: {
            items: [{ id: args.user.cityId, name: 'Санкт-Петербург' }],
            status: 'succeeded' as const,
          },
          categories: { items: categories, status: 'succeeded' as const },
          skills: {
            items: [
              createSkill({
                id: args.user.teachSkillId,
                title: 'Игра на барабанах',
                categoryId: 'creativity',
                subcategoryId: 'photography',
              }),
            ],
            status: 'succeeded' as const,
            error: null,
          },
          session: {
            session: parameters.authorized
              ? { userId: 'current-user-id', token: 'mock-token' }
              : null,
          },
          exchanges: {
            items: parameters.proposed
              ? [
                  {
                    id: 'exchange-story',
                    fromUserId: 'current-user-id',
                    toUserId: args.user.id,
                    skillId: args.user.teachSkillId,
                    createdAt: '2026-01-15T10:00:00.000Z',
                  },
                ]
              : [],
            status: 'succeeded' as const,
            error: null,
            pendingRequests: 0,
          },
        },
      })
      return (
        <Provider store={store}>
          <MemoryRouter>
            <div style={{ width: 324 }}>
              <Story />
            </div>
          </MemoryRouter>
        </Provider>
      )
    },
  ],
} satisfies Meta<typeof OfferCard>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}
export const NoLikes: Story = { args: { user: createUser({ ...author, likesCount: 0 }) } }
export const NoPhoto: Story = { args: { user: createUser({ ...author, avatarUrl: null }) } }
export const LongName: Story = {
  args: { user: createUser({ ...author, name: 'Александра-Екатерина', likesCount: 12345 }) },
}

export const Guest: Story = {
  parameters: { proposed: true },
}

export const Authorized: Story = {
  parameters: { authorized: true },
}

export const WithProposedExchange: Story = {
  parameters: {
    authorized: true,
    proposed: true,
    design: {
      type: 'figma',
      url: 'https://www.figma.com/design/40gXmyAoxwwnb9kBxI5B8y/SkillSwap-Red.1-?node-id=1-2106',
    },
  },
}
