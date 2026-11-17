import { ToastContext } from '@/shared/lib/toast'
import { configureStore } from '@reduxjs/toolkit'
import { Provider } from 'react-redux'
import { MemoryRouter } from 'react-router-dom'
import { sessionReducer } from '@/entities/session'
import { usersReducer } from '@/entities/user'
import { favoriteToggleReducer } from '@/features/favorite-toggle'
import type { Meta, StoryObj } from '@storybook/react-vite'
import { useState } from 'react'

import { createSkill } from '@/entities/skill/testing'
import { createUser } from '@/entities/user/testing'

import { SkillDetails, type SkillDetailsProps } from './SkillDetails'

const FIGMA = 'https://www.figma.com/design/40gXmyAoxwwnb9kBxI5B8y/SkillSwap-Red.1-?node-id='

const author = createUser({
  id: 'u01',
  name: 'Иван',
  avatarUrl: '/images/avatars/u01.jpg',
  about: 'Привет! Люблю ритм, кофе по утрам и людей, которые не боятся пробовать новое.',
  teachSkillId: 's01',
  likesCount: 158,
})

const skill = createSkill({
  id: 's01',
  authorId: author.id,
  title: 'Игра на барабанах',
  description:
    'Привет! Я играю на барабанах уже больше 10 лет — от репетиций в гараже до выступлений на сцене с живыми группами. Научу основам техники, играть любимые ритмы и разбирать песни, импровизировать и звучать уверенно даже без партитуры.',
  categoryId: 'creativity',
  subcategoryId: 'music',
  images: [
    '/images/skills/s01-1.jpg',
    '/images/skills/s01-2.jpg',
    '/images/skills/s01-3.jpg',
    '/images/skills/s01-4.jpg',
  ],
})

const learn = [
  { id: 'time-management', title: 'Тайм-менеджмент', categoryId: 'business' },
  { id: 'english', title: 'Английский', categoryId: 'languages' },
  { id: 'photo', title: 'Фотография', categoryId: 'creativity' },
]

/** Родитель держит состояние, как страница: клик по «Предложить обмен» → «Обмен предложен» */
function InteractiveSkillDetails(args: SkillDetailsProps) {
  const [isProposed, setIsProposed] = useState(args.isExchangeProposed ?? false)
  return (
    <SkillDetails
      {...args}
      isExchangeProposed={isProposed}
      onProposeExchange={() => setIsProposed(true)}
    />
  )
}

const meta = {
  title: 'widgets/skill-details/SkillDetails',
  component: SkillDetails,
  tags: ['autodocs'],
  args: {
    skill,
    author,
    cityName: 'Санкт-Петербург',
    categoryTitle: 'Творчество и искусство',
    subcategoryTitle: 'Музыка и звук',
    learnSubcategories: learn,
  },
  parameters: {
    layout: 'padded',
    design: { type: 'figma', url: `${FIGMA}1-2764` },
    docs: {
      description: {
        component:
          'P3-09: данные приходят пропсами, их собирает страница. «Поделиться» и «⋯» — заглушки, сердечко P5-07 в гостевом состоянии переводит на вход.',
      },
    },
  },
  decorators: [
    (Story) => (
      <Provider
        store={configureStore({
          reducer: {
            session: sessionReducer,
            users: usersReducer,
            favoriteToggle: favoriteToggleReducer,
          },
          preloadedState: { session: { session: null } },
        })}
      >
        <ToastContext.Provider value={{ showToast: () => {}, removeToast: () => {} }}>
          <MemoryRouter>
            <div style={{ maxWidth: 'var(--container-width)', margin: '0 auto' }}>
              <Story />
            </div>
          </MemoryRouter>
        </ToastContext.Provider>
      </Provider>
    ),
  ],
} satisfies Meta<typeof SkillDetails>

export default meta

type Story = StoryObj<typeof meta>

/** «Предложить обмен» — основная кнопка, макет 1:2764. Кликабельна: после клика становится «Обмен предложен» */
export const Default: Story = {
  render: (args) => <InteractiveSkillDetails {...args} />,
}

/** «Обмен предложен» — обведённая неактивная кнопка, макет 1:1919 */
export const ExchangeProposed: Story = {
  args: { isExchangeProposed: true },
  parameters: { design: { type: 'figma', url: `${FIGMA}1-1919` } },
}
