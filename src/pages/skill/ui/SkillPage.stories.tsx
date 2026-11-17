import { configureStore } from '@reduxjs/toolkit'
import type { Meta, StoryObj } from '@storybook/react-vite'
import { Provider } from 'react-redux'
import { MemoryRouter, Route, Routes } from 'react-router-dom'

import { categoriesReducer, type Category } from '@/entities/category'
import { citiesReducer, type City } from '@/entities/city'
import { exchangesReducer, type ExchangesState } from '@/entities/exchange'
import { notificationsReducer, type NotificationsState } from '@/entities/notification'
import { skillsReducer, type Skill } from '@/entities/skill'
import { sessionReducer } from '@/entities/session'
import { usersReducer, type User } from '@/entities/user'
import { favoriteToggleReducer } from '@/features/favorite-toggle'
import { ToastContext } from '@/shared/lib/toast'
import { loadSeed } from '@/shared/api'
import { getSkillRoute, ROUTES } from '@/shared/config'

import { SkillPage } from './SkillPage'

const FIGMA = 'https://www.figma.com/design/40gXmyAoxwwnb9kBxI5B8y/SkillSwap-Red.1-?node-id='

interface Seeds {
  skills: readonly Skill[]
  users: readonly User[]
  categories: readonly Category[]
  cities: readonly City[]
}

/**
 * Страница читает данные из Redux через селекторы. Storybook заполняет store теми же seed-файлами,
 * чтобы история проверяла реальный путь страницы без запросов из компонента.
 */
const meta = {
  title: 'pages/skill/SkillPage',
  component: SkillPage,
  parameters: {
    layout: 'fullscreen',
    design: { type: 'figma', url: `${FIGMA}1-2764` },
    docs: {
      description: {
        component:
          'Страница получает навык, автора и справочники из Redux. P7-02: selectSimilarUsers подбирает других авторов той же подкатегории; без совпадений блок скрыт. P7-03 подключает обмен, уведомление, toast и окно подтверждения через API P4-07.',
      },
    },
  },
  loaders: [
    async () => ({
      seeds: {
        skills: await loadSeed<Skill>('skills')(),
        users: await loadSeed<User>('users')(),
        categories: await loadSeed<Category>('categories')(),
        cities: await loadSeed<City>('cities')(),
      } satisfies Seeds,
    }),
  ],
} satisfies Meta<typeof SkillPage>

export default meta

type Story = StoryObj<typeof meta>

function renderAt(skillId: string): Story['render'] {
  return function Render(_args, { loaded }) {
    const { skills, users, categories, cities } = loaded.seeds as Seeds
    const store = configureStore({
      reducer: {
        cities: citiesReducer,
        categories: categoriesReducer,
        skills: skillsReducer,
        users: usersReducer,
        exchanges: exchangesReducer,
        notifications: notificationsReducer,
        session: sessionReducer,
        favoriteToggle: favoriteToggleReducer,
      },
      preloadedState: {
        cities: { items: [...cities], status: 'succeeded' as const },
        categories: { items: [...categories], status: 'succeeded' as const },
        skills: {
          saveStatus: 'idle' as const,
          pendingSaves: 0,
          saveError: null,
          items: [...skills],
          status: 'succeeded' as const,
          error: null,
        },
        users: {
          saveStatus: 'idle' as const,
          pendingSaves: 0,
          saveError: null,
          items: [...users],
          status: 'succeeded' as const,
          error: null,
        },
        session: {
          session: {
            userId: 'u01',
            token: 'fake-token',
          },
        },
        exchanges: {
          items: [],
          status: 'succeeded' as const,
          pendingRequests: 0,
          error: null,
        } satisfies ExchangesState,
        notifications: {
          items: [],
          status: 'succeeded' as const,
          pendingRequests: 0,
          error: null,
        } satisfies NotificationsState,
      },
    })
    return (
      <Provider store={store}>
        <ToastContext.Provider value={{ showToast: () => {}, removeToast: () => {} }}>
          <MemoryRouter initialEntries={[getSkillRoute(skillId)]}>
            <Routes>
              <Route path={ROUTES.SKILL} element={<SkillPage />} />
            </Routes>
          </MemoryRouter>
        </ToastContext.Provider>
      </Provider>
    )
  }
}

/** Игра на барабанах: автор, четыре фото в галерее, «Похожие предложения» */
export const Default: Story = { render: renderAt('s01') }

/** Нет похожих предложений — блок внизу не показывается */
export const NoSimilarOffers: Story = { render: renderAt('s03') }
