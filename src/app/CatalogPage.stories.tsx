import type { Meta, StoryObj } from '@storybook/react-vite'
import { Provider } from 'react-redux'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import { expect, userEvent, within } from 'storybook/test'
import type { Category } from '@/entities/category'
import type { City } from '@/entities/city'
import type { Skill } from '@/entities/skill'
import type { User } from '@/entities/user'
import { CatalogPage } from '@/pages/catalog'
import { loadSeed } from '@/shared/api'
import { CATALOG } from '@/shared/config'
import { createAppStore } from './store'
import { MainLayout } from './layouts/MainLayout'

const meta = {
  title: 'app/CatalogPage',
  component: CatalogPage,
  parameters: {
    layout: 'fullscreen',
    design: {
      type: 'figma',
      url: 'https://www.figma.com/design/40gXmyAoxwwnb9kBxI5B8y/SkillSwap-Red.1-?node-id=1-2861',
    },
    docs: {
      description: {
        component:
          'P5-05: CatalogPage читает catalogFilter и searchQuery из store, применяет applyFilters и переключает вёрстку на «Подходящие предложения: N» при активном фильтре или поиске. Results и SearchResults — те же виды, но фильтры и поиск выставлены через parameters и preloadedState. Плашки и сортировка записываются в store; их управляемое поведение показано отдельно в stories ActiveFilters/SortToggle. P5-06: «Рекомендуем» и результаты показывают по 6 карточек; при прокрутке к концу — спиннер на 1 с и ещё 6. Смена фильтров начинает ленту сначала. Пустые состояния — решения вне Figma.',
      },
    },
  },
  loaders: [
    async () => {
      const [users, skills, categories, cities] = await Promise.all([
        loadSeed<User>('users')(),
        loadSeed<Skill>('skills')(),
        loadSeed<Category>('categories')(),
        loadSeed<City>('cities')(),
      ])
      return { users, skills, categories, cities }
    },
  ],
  decorators: [
    (Story, { loaded, parameters }) => {
      const slice = parameters.results ? CATALOG.SECTION_EXPANDED : undefined
      const users = parameters.empty ? [] : (loaded.users as User[]).slice(0, slice)

      const store = createAppStore({
        users: {
          saveStatus: 'idle' as const,
          pendingSaves: 0,
          saveError: null,
          items: users,
          status: 'succeeded',
          error: null,
        },
        search: { query: parameters.searchQuery ?? '' },
        catalogFilter: {
          mode: parameters.mode ?? 'all',
          subcategoryIds: parameters.subcategoryIds ?? [],
          gender: parameters.gender ?? null,
          cityIds: parameters.cityIds ?? [],
          sort: 'newest' as const,
        },
        skills: {
          saveStatus: 'idle' as const,
          pendingSaves: 0,
          saveError: null,
          items: loaded.skills,
          status: 'succeeded',
          error: null,
        },
        categories: { items: loaded.categories, status: 'succeeded' },
        cities: { items: loaded.cities, status: 'succeeded' },
        exchanges: { items: [], status: 'succeeded', pendingRequests: 0, error: null },
      })

      return (
        <Provider store={store}>
          <MemoryRouter>
            <Routes>
              <Route element={<MainLayout />}>
                <Route path="/" element={<Story />} />
              </Route>
            </Routes>
          </MemoryRouter>
        </Provider>
      )
    },
  ],
} satisfies Meta<typeof CatalogPage>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}

export const Results: Story = {
  parameters: {
    results: true,
    mode: 'learn' as const,
    subcategoryIds: ['english'] as const,
    design: {
      type: 'figma',
      url: 'https://www.figma.com/design/40gXmyAoxwwnb9kBxI5B8y/SkillSwap-Red.1-?node-id=1-2860',
    },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await expect(
      canvas.getByRole('heading', { name: /Подходящие предложения/ }),
    ).toBeInTheDocument()
    await expect(canvas.getByRole('button', { name: 'Удалить Хочу научиться' })).toBeInTheDocument()
    await expect(canvas.getByRole('button', { name: 'Удалить Английский' })).toBeInTheDocument()
    await expect(canvas.getByRole('button', { name: 'Сначала новые' })).toBeInTheDocument()
    await userEvent.click(canvas.getByRole('button', { name: 'Сначала новые' }))
    await expect(canvas.getByRole('button', { name: 'Сначала старые' })).toBeInTheDocument()
  },
}

export const SearchResults: Story = {
  parameters: {
    results: true,
    searchQuery: 'Игра на барабанах',
    design: {
      type: 'figma',
      url: 'https://www.figma.com/design/40gXmyAoxwwnb9kBxI5B8y/SkillSwap-Red.1-?node-id=1-2819',
    },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await expect(
      canvas.getByRole('heading', { name: /Подходящие предложения/ }),
    ).toBeInTheDocument()
  },
}

export const Empty: Story = { parameters: { empty: true } }

export const EmptyResults: Story = {
  parameters: {
    empty: true,
    results: true,
    mode: 'learn' as const,
    subcategoryIds: ['english'] as const,
    design: {
      type: 'figma',
      url: 'https://www.figma.com/design/40gXmyAoxwwnb9kBxI5B8y/SkillSwap-Red.1-?node-id=1-2860',
    },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await expect(canvas.getByRole('status')).toHaveTextContent('Ничего не нашлось')
  },
}
