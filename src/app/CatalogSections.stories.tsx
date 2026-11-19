import type { Meta, StoryObj } from '@storybook/react-vite'
import { Provider } from 'react-redux'
import { MemoryRouter, Route, Routes, useParams } from 'react-router-dom'

import type { Category } from '@/entities/category'
import { createSkill } from '@/entities/skill/testing'
import type { PublicUser } from '@/entities/user'
import { createUser } from '@/entities/user/testing'
import { ROUTES } from '@/shared/config'
import { OfferCard } from '@/widgets/offer-card'
import { OffersSection } from '@/widgets/offers-section'
import { ToastProvider } from '@/app/providers/ToastProvider'

import { createAppStore } from './store'

const users = Array.from({ length: 12 }, (_, index) =>
  createUser({
    id: `u-${index + 1}`,
    name: ['Иван', 'Анна', 'Максим'][index % 3],
    avatarUrl: `/images/avatars/u${String(index + 1).padStart(2, '0')}.jpg`,
    teachSkillId: `s-${index + 1}`,
    learnSubcategoryIds: ['time-management', 'yoga', 'english', 'photography'],
    likesCount: 12 - index,
  }),
)
const skills = users.map((user) =>
  createSkill({
    id: user.teachSkillId,
    authorId: user.id,
    title: 'Игра на барабанах',
    categoryId: 'creativity',
    subcategoryId: 'photography',
  }),
)
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
const renderItem = (user: PublicUser) => <OfferCard user={user} />

function SkillDestination() {
  const { id } = useParams()
  return <h1>Страница навыка {id}</h1>
}

/**
 * Демонстрация OfferCard и OffersSection на уровне app для P3-08 / P7-04.
 * Данные фабрик передаются в store: Default показывает ссылки, WithProposedExchange — собственное предложение.
 * Не реализует страницу каталога и не загружает обмены из базы.
 * @see Figma: секции каталога (1:2871), каталог с предложенным обменом (1:2106)
 */
function CatalogSections({ proposed = false }: { proposed?: boolean }) {
  const store = createAppStore({
    cities: {
      items: [{ id: users[0].cityId, name: 'Санкт-Петербург' }],
      status: 'succeeded' as const,
    },
    categories: { items: categories, status: 'succeeded' as const },
    skills: {
      saveStatus: 'idle' as const,
      pendingSaves: 0,
      saveError: null,
      items: skills,
      status: 'succeeded' as const,
      error: null,
    },
    session: { session: proposed ? { userId: 'catalog-viewer', token: 'test' } : null },
    exchanges: {
      items: proposed
        ? [
            {
              id: 'catalog-exchange',
              fromUserId: 'catalog-viewer',
              toUserId: users[0].id,
              skillId: users[0].teachSkillId,
              createdAt: '2026-01-15T10:00:00.000Z',
            },
          ]
        : [],
      status: 'succeeded',
      pendingRequests: 0,
      error: null,
    },
  })
  return (
    <Provider store={store}>
      <ToastProvider>
        <MemoryRouter>
          <Routes>
            <Route
              path={ROUTES.HOME}
              element={
                <main
                  style={{
                    width: 1020,
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 'var(--space-40)',
                  }}
                >
                  <OffersSection
                    title="Популярное"
                    users={users}
                    mode="expandable"
                    renderItem={renderItem}
                  />
                  <OffersSection
                    title="Новое"
                    users={users.slice().reverse()}
                    mode="expandable"
                    renderItem={renderItem}
                  />
                  <OffersSection
                    title="Рекомендуем"
                    users={users.slice(0, 6)}
                    mode="infinite"
                    renderItem={renderItem}
                  />
                </main>
              }
            />
            <Route path={ROUTES.SKILL} element={<SkillDestination />} />
          </Routes>
        </MemoryRouter>
      </ToastProvider>
    </Provider>
  )
}

const meta = {
  title: 'app/CatalogSections',
  component: CatalogSections,
  parameters: {
    layout: 'padded',
    design: {
      type: 'figma',
      url: 'https://www.figma.com/design/40gXmyAoxwwnb9kBxI5B8y/SkillSwap-Red.1-?node-id=1-2871',
    },
    docs: {
      description: {
        component:
          'P3-08 / P7-04: совместная проверка OfferCard и OffersSection. Две секции раскрываются независимо, следующая секция плавно сдвигается. «Подробнее» ведёт на демонстрационный маршрут навыка, а собственное предложение показывает статичный статус «Обмен предложен». Счётчик рядом с сердечком — требование ТЗ; анимация 250 ms и подпись «Свернуть» — решения для поведения, не показанного в Figma.',
      },
    },
  },
} satisfies Meta<typeof CatalogSections>

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {}

export const WithProposedExchange: Story = {
  args: { proposed: true },
  parameters: {
    design: {
      type: 'figma',
      url: 'https://www.figma.com/design/40gXmyAoxwwnb9kBxI5B8y/SkillSwap-Red.1-?node-id=1-2106',
    },
  },
}
