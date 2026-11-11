import type { Meta, StoryObj } from '@storybook/react-vite'
import { Provider } from 'react-redux'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import { expect, fn, userEvent, within } from 'storybook/test'
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
          'P3-10: одна CatalogPage в MainLayout для всех состояний. Данные из базы, порядок секций пока общий. Results и SearchResults — статичные виды результатов; обработчики плашек и сортировки записываются в Actions. Их управляемое поведение показано отдельно в stories ActiveFilters/SortToggle. P5-02 сохраняет выбор панели в store, а применение к списку и результаты — P5-05; порядок секций — P5-04. Пустые и ошибочные состояния — решения вне Figma.',
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
    (Story, { args, loaded, parameters }) => {
      const status = parameters.failed
        ? ('failed' as const)
        : parameters.loading
          ? ('loading' as const)
          : ('succeeded' as const)
      const users = parameters.empty
        ? []
        : (loaded.users as User[]).slice(0, args.results ? CATALOG.SECTION_EXPANDED : undefined)
      const store = createAppStore({
        users: { items: users, status, error: null },
        search: { query: parameters.searchQuery ?? '' },
        skills: { items: loaded.skills, status: 'succeeded', error: null },
        categories: { items: loaded.categories, status: 'succeeded' },
        cities: { items: loaded.cities, status: 'succeeded' },
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
  args: {
    results: {
      filters: [
        { id: 'mode', label: 'Хочу научиться' },
        { id: 'english', label: 'Английский' },
      ],
      sort: 'newest',
      onRemoveFilter: fn(),
      onSortChange: fn(),
    },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await userEvent.click(canvas.getByRole('radio', { name: 'Хочу научиться' }))
    await userEvent.click(
      canvas.getByRole('button', { name: 'Развернуть категорию «Иностранные языки»' }),
    )
    await userEvent.click(canvas.getByRole('checkbox', { name: /^Английский$/ }))
    await expect(canvas.getByRole('radio', { name: 'Хочу научиться' })).toBeChecked()
    await expect(canvas.getByRole('checkbox', { name: /^Английский$/ })).toBeChecked()
  },
  parameters: {
    design: {
      type: 'figma',
      url: 'https://www.figma.com/design/40gXmyAoxwwnb9kBxI5B8y/SkillSwap-Red.1-?node-id=1-2860',
    },
  },
}
export const SearchResults: Story = {
  args: {
    results: { filters: [], sort: 'newest', onRemoveFilter: fn(), onSortChange: fn() },
  },
  parameters: {
    searchQuery: 'Игра на барабанах',
    design: {
      type: 'figma',
      url: 'https://www.figma.com/design/40gXmyAoxwwnb9kBxI5B8y/SkillSwap-Red.1-?node-id=1-2819',
    },
  },
}
export const Empty: Story = { parameters: { empty: true } }
export const EmptyResults: Story = {
  args: Results.args,
  parameters: { empty: true },
  play: Results.play,
}
export const Loading: Story = { parameters: { loading: true } }
export const Failed: Story = { parameters: { failed: true } }
