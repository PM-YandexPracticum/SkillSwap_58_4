import { StrictMode } from 'react'
import { screen, within } from '@testing-library/react'
import { Route, Routes } from 'react-router-dom'

import { renderWithProviders } from '@/app/test/renderWithProviders'
import * as categoryEntity from '@/entities/category'
import type { Category } from '@/entities/category'
import * as cities from '@/entities/city'
import * as skills from '@/entities/skill'
import { createSkill } from '@/entities/skill/testing'
import * as users from '@/entities/user'
import { createUser } from '@/entities/user/testing'
import { getSkillRoute, ROUTES } from '@/shared/config'

import { SkillPage } from './SkillPage'

// Карусели на Embla в jsdom не нужны: достаточно слайдов
vi.mock('@/shared/ui/Carousel', () => ({
  Carousel: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="carousel">{children}</div>
  ),
}))

const author = createUser({
  id: 'u01',
  name: 'Иван',
  teachSkillId: 's01',
  cityId: 'spb',
  about: 'Люблю ритм',
})
const skill = createSkill({
  id: 's01',
  authorId: author.id,
  title: 'Игра на барабанах',
  categoryId: 'creativity',
  subcategoryId: 'music',
})
const similarUser = createUser({ id: 'u02', name: 'Наталья', teachSkillId: 's02' })
const similarSkill = createSkill({
  id: 's02',
  authorId: similarUser.id,
  title: 'Игра на гитаре',
  categoryId: 'creativity',
  subcategoryId: 'music',
})
const skillWithoutSimilar = createSkill({
  id: 's03',
  authorId: author.id,
  title: 'Тайм-менеджмент для фрилансеров',
  categoryId: 'creativity',
  subcategoryId: 'time',
})
const categories: Category[] = [
  {
    id: 'creativity',
    title: 'Творчество и искусство',
    icon: 'creative',
    color: 'creativity',
    subcategories: [
      { id: 'music', title: 'Музыка и звук', categoryId: 'creativity' },
      { id: 'time', title: 'Тайм-менеджмент', categoryId: 'creativity' },
    ],
  },
]

const preloadedState = {
  users: { items: [author, similarUser], status: 'succeeded' as const, error: null },
  skills: {
    items: [skill, similarSkill, skillWithoutSimilar],
    status: 'succeeded' as const,
    error: null,
  },
  categories: { items: categories, status: 'succeeded' as const },
  cities: { items: [{ id: 'spb', name: 'Санкт-Петербург' }], status: 'succeeded' as const },
}

function spyOnLoads() {
  return {
    users: vi.spyOn(users, 'fetchUsers'),
    skills: vi.spyOn(skills, 'fetchSkills'),
    categories: vi.spyOn(categoryEntity, 'fetchCategories'),
    cities: vi.spyOn(cities, 'fetchCities'),
  }
}

afterEach(() => vi.restoreAllMocks())

function renderSkillPage(skillId: string) {
  return renderWithProviders(<SkillPage />, {
    path: ROUTES.SKILL,
    route: getSkillRoute(skillId),
    preloadedState,
  })
}

describe('SkillPage', () => {
  it('загружает данные при прямом открытии и не запускает thunk-и повторно в StrictMode', async () => {
    const loads = spyOnLoads()
    const { store } = renderWithProviders(
      <StrictMode>
        <SkillPage />
      </StrictMode>,
      { path: ROUTES.SKILL, route: getSkillRoute('s01') },
    )

    expect(
      await screen.findByRole('heading', { level: 1, name: 'Игра на барабанах' }),
    ).toBeInTheDocument()
    expect(store.getState().users.status).toBe('succeeded')
    expect(store.getState().skills.status).toBe('succeeded')
    expect(store.getState().categories.status).toBe('succeeded')
    expect(store.getState().cities.status).toBe('succeeded')
    for (const load of Object.values(loads)) expect(load).toHaveBeenCalledTimes(1)
  })

  it('показывает навык, его автора и справочные названия из базы', async () => {
    renderSkillPage('s01')

    expect(
      await screen.findByRole('heading', { level: 1, name: 'Игра на барабанах' }),
    ).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: 'Иван' })).toBeInTheDocument()
    expect(screen.getByText('Творчество и искусство / Музыка и звук')).toBeInTheDocument()
    expect(screen.getAllByText(/^Санкт-Петербург, /).length).toBeGreaterThan(0)
  })

  it('внизу — «Похожие предложения»: другие авторы той же подкатегории, без самого автора', async () => {
    renderSkillPage('s01')

    const section = await screen.findByRole('region', { name: 'Похожие предложения' })

    expect(within(section).getByRole('heading', { name: 'Наталья' })).toBeInTheDocument()
    expect(within(section).queryByRole('heading', { name: 'Иван' })).not.toBeInTheDocument()
  })

  it('если похожих нет — блока «Похожие предложения» нет', async () => {
    renderSkillPage('s03')

    await screen.findByRole('heading', { level: 1, name: 'Тайм-менеджмент для фрилансеров' })

    expect(screen.queryByRole('region', { name: 'Похожие предложения' })).not.toBeInTheDocument()
  })

  it('«Предложить обмен» открывает окно «Вы предложили обмен», после «Готово» кнопка — «Обмен предложен»', async () => {
    const { user } = renderSkillPage('s01')
    await user.click(await screen.findByRole('button', { name: 'Предложить обмен' }))

    expect(screen.getByRole('dialog', { name: 'Вы предложили обмен' })).toBeInTheDocument()

    await user.click(screen.getByRole('button', { name: 'Готово' }))

    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Обмен предложен' })).toBeDisabled()
    expect(screen.queryByRole('button', { name: 'Предложить обмен' })).not.toBeInTheDocument()
  })

  it('закрытие модалки через Escape не подтверждает обмен', async () => {
    const { user } = renderSkillPage('s01')
    await user.click(await screen.findByRole('button', { name: 'Предложить обмен' }))

    await user.keyboard('{Escape}')

    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Предложить обмен' })).toBeEnabled()
  })

  it('при ошибке загрузки — страница ошибки сервера', async () => {
    renderWithProviders(
      <Routes>
        <Route path={ROUTES.SKILL} element={<SkillPage />} />
        <Route path={ROUTES.SERVER_ERROR} element={<h1>Ошибка сервера</h1>} />
      </Routes>,
      {
        route: getSkillRoute('s01'),
        preloadedState: {
          users: { items: [], status: 'failed', error: 'Не удалось загрузить пользователей' },
          skills: { items: [], status: 'succeeded', error: null },
          categories: { items: [], status: 'succeeded' },
          cities: { items: [], status: 'succeeded' },
        },
      },
    )

    expect(await screen.findByRole('heading', { name: 'Ошибка сервера' })).toBeInTheDocument()
  })

  it('неизвестный навык открывает страницу 404', async () => {
    renderWithProviders(
      <Routes>
        <Route path={ROUTES.SKILL} element={<SkillPage />} />
        <Route path={ROUTES.NOT_FOUND} element={<h1>Страница не найдена</h1>} />
      </Routes>,
      { route: getSkillRoute('unknown'), preloadedState },
    )

    expect(await screen.findByRole('heading', { name: 'Страница не найдена' })).toBeInTheDocument()
  })

  it('показывает Loader, пока store загружает данные', () => {
    renderWithProviders(<SkillPage />, {
      path: ROUTES.SKILL,
      route: getSkillRoute('s01'),
      preloadedState: {
        users: { items: [], status: 'loading', error: null },
        skills: { items: [], status: 'loading', error: null },
        categories: { items: [], status: 'loading' },
        cities: { items: [], status: 'loading' },
      },
    })

    expect(screen.getByRole('status', { name: 'Загрузка' })).toBeInTheDocument()
  })
})
