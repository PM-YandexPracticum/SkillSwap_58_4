import { configureStore } from '@reduxjs/toolkit'
import type { Meta, StoryObj } from '@storybook/react-vite'
import { Provider } from 'react-redux'
import { MemoryRouter, Route, Routes } from 'react-router-dom'

import { categoriesReducer, type Category } from '@/entities/category'
import { citiesReducer, type City } from '@/entities/city'
import { skillsReducer, type Skill } from '@/entities/skill'
import { loadSeed } from '@/shared/api'
import { getSkillRoute, ROUTER_FUTURE, ROUTES } from '@/shared/config'

import { SkillPage } from './SkillPage'
import { exchangesReducer, ExchangesState } from '@/entities/exchange'
import { sessionReducer } from '@/entities/session'

const FIGMA = 'https://www.figma.com/design/40gXmyAoxwwnb9kBxI5B8y/SkillSwap-Red.1-?node-id='

interface Seeds {
  skills: readonly Skill[]
  categories: readonly Category[]
  cities: readonly City[]
}

/**
 * Страница сама читает данные из `public/db` через `entities/*\/api`. Справочники для `OfferCard`
 * в «Похожих предложениях» он берёт из store, поэтому здесь store заполняется теми же файлами через `loaders`.
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
          'P3-09: верстка страницы навыка. «Предложить обмен» открывает окно «Вы предложили обмен» (1:1977), после «Готово» кнопка становится «Обмен предложен» (1:1919) — только вид, ничего не сохраняется.',
      },
    },
  },
  loaders: [
    async () => ({
      seeds: {
        skills: await loadSeed<Skill>('skills')(),
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
    const { skills, categories, cities } = loaded.seeds as Seeds
    const store = configureStore({
      reducer: { cities: citiesReducer, categories: categoriesReducer, skills: skillsReducer, exchanges: exchangesReducer, session: sessionReducer, },
      preloadedState: {
        cities: { items: [...cities], status: 'succeeded' as const },
        categories: { items: [...categories], status: 'succeeded' as const },
        skills: { items: [...skills], status: 'succeeded' as const, error: null },
        session: {
          session: {
            userId: 'u01',
            token: 'fake-token'
          },
        },
        exchanges: {
          items: [],
          status: 'succeeded',
          pendingRequests: 0,
          error: null,
        } satisfies ExchangesState,
      },
    })
    return (
      <Provider store={store}>
        <MemoryRouter initialEntries={[getSkillRoute(skillId)]} future={ROUTER_FUTURE}>
          <Routes>
            <Route path={ROUTES.SKILL} element={<SkillPage />} />
          </Routes>
        </MemoryRouter>
      </Provider>
    )
  }
}

/** Игра на барабанах: автор, четыре фото в галерее, «Похожие предложения» */
export const Default: Story = { render: renderAt('s01') }

/** Нет похожих предложений — блок внизу не показывается */
export const NoSimilarOffers: Story = { render: renderAt('s03') }
