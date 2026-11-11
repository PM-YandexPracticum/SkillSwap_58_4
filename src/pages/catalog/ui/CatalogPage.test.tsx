import { StrictMode } from 'react'
import { screen, within } from '@testing-library/react'
import { renderWithProviders } from '@/app/test/renderWithProviders'
import * as categories from '@/entities/category'
import * as cities from '@/entities/city'
import * as exchanges from '@/entities/exchange'
import * as skills from '@/entities/skill'
import * as users from '@/entities/user'
import { createUser } from '@/entities/user/testing'
import { CatalogPage } from './CatalogPage'

const ready: Partial<RootState> = {
  users: { items: [createUser()], status: 'succeeded', error: null },
  skills: { items: [], status: 'succeeded', error: null },
  categories: { items: [], status: 'succeeded' },
  cities: { items: [], status: 'succeeded' },
}

function spyOnLoads() {
  return {
    users: vi.spyOn(users, 'fetchUsers'),
    skills: vi.spyOn(skills, 'fetchSkills'),
    categories: vi.spyOn(categories, 'fetchCategories'),
    cities: vi.spyOn(cities, 'fetchCities'),
  }
}

/** Карточки секции по её заголовку: свёрнутая часть скрыта от дерева доступности. */
const cardsOf = (title: string) =>
  within(screen.getByRole('region', { name: title })).getAllByRole('article')

afterEach(() => vi.restoreAllMocks())

describe('CatalogPage', () => {
  it('загружает данные при прямом открытии и предоставляет один main и h1', async () => {
    const loads = spyOnLoads()
    const { store } = renderWithProviders(
      <StrictMode>
        <CatalogPage />
      </StrictMode>,
    )
    expect(screen.getByRole('status', { name: 'Загрузка' })).toBeInTheDocument()
    expect(await screen.findByRole('heading', { name: 'Популярное' })).toBeInTheDocument()
    expect(screen.getAllByRole('main')).toHaveLength(1)
    expect(screen.getAllByRole('heading', { level: 1 })).toHaveLength(1)
    expect(store.getState().users.status).toBe('succeeded')
    expect(store.getState().skills.status).toBe('succeeded')
    for (const load of Object.values(loads)) expect(load).toHaveBeenCalledTimes(1)
  })
  it('показывает уже загруженные данные сразу, не перезапрашивает их', () => {
    const loads = spyOnLoads()
    const { store } = renderWithProviders(<CatalogPage />, { preloadedState: ready })
    expect(screen.getByRole('heading', { name: 'Популярное' })).toBeInTheDocument()
    expect(store.getState().users.items).toEqual(ready.users?.items)
    expect(screen.queryByRole('status', { name: 'Загрузка' })).not.toBeInTheDocument()
    for (const load of Object.values(loads)) expect(load).not.toHaveBeenCalled()
  })
  it('использует ту же оболочку страницы для результатов', () => {
    renderWithProviders(
      <CatalogPage
        results={{
          filters: [],
          sort: 'newest',
          onRemoveFilter: vi.fn(),
          onSortChange: vi.fn(),
        }}
      />,
      { preloadedState: ready },
    )
    expect(screen.getByRole('heading', { name: 'Подходящие предложения: 1' })).toBeInTheDocument()
    expect(screen.getAllByRole('main')).toHaveLength(1)
    expect(
      screen.getByRole('heading', { level: 1, name: 'Каталог предложений' }),
    ).toBeInTheDocument()
  })
  it.each(['users', 'skills', 'categories', 'cities'] as const)(
    'не перезапускает уже начатую загрузку %s',
    (key) => {
      const loads = spyOnLoads()
      renderWithProviders(<CatalogPage />, {
        preloadedState: { ...ready, [key]: { ...ready[key], status: 'loading' } },
      })
      expect(screen.getByRole('status', { name: 'Загрузка' })).toBeInTheDocument()
      for (const load of Object.values(loads)) expect(load).not.toHaveBeenCalled()
    },
  )
  it.each(['users', 'skills', 'categories', 'cities'] as const)(
    'повторяет только неудачную загрузку %s',
    async (key) => {
      const loads = spyOnLoads()
      const { user, store } = renderWithProviders(<CatalogPage />, {
        preloadedState: { ...ready, [key]: { ...ready[key], status: 'failed' } },
      })
      expect(screen.getByRole('alert')).toHaveTextContent('Не удалось загрузить каталог')
      const loaded = key === 'users' ? store.getState().skills.items : store.getState().users.items
      await user.click(screen.getByRole('button', { name: 'Попробовать снова' }))
      expect(await screen.findByRole('heading', { name: 'Популярное' })).toBeInTheDocument()
      expect(store.getState()[key].status).toBe('succeeded')
      expect(key === 'users' ? store.getState().skills.items : store.getState().users.items).toBe(
        loaded,
      )
      for (const [name, load] of Object.entries(loads)) {
        expect(load).toHaveBeenCalledTimes(name === key ? 1 : 0)
      }
    },
  )
  describe('секции «Популярное» и «Новое» (P5-04)', () => {
    // likesCount растёт с номером, дата регистрации — наоборот: Автор 0 самый новый.
    const items = Array.from({ length: 12 }, (_, i) =>
      createUser({
        id: `u${i}`,
        name: `Автор ${i}`,
        likesCount: i,
        createdAt: new Date(Date.UTC(2026, 0, 20 - i)).toISOString(),
      }),
    )
    const withUsers: Partial<RootState> = {
      ...ready,
      users: { items, status: 'succeeded', error: null },
    }

    it('«Популярное» — по лайкам, «Новое» — по дате регистрации, по 3 карточки', () => {
      renderWithProviders(<CatalogPage />, { preloadedState: withUsers })

      const popular = cardsOf('Популярное')
      expect(popular).toHaveLength(3)
      expect(popular[0]).toHaveTextContent('Автор 11')
      expect(popular[1]).toHaveTextContent('Автор 10')
      expect(popular[2]).toHaveTextContent('Автор 9')

      const newest = cardsOf('Новое')
      expect(newest).toHaveLength(3)
      expect(newest[0]).toHaveTextContent('Автор 0')
      expect(newest[1]).toHaveTextContent('Автор 1')
      expect(newest[2]).toHaveTextContent('Автор 2')

      expect(cardsOf('Рекомендуем')[0]).toHaveTextContent('Автор 0')
    })

    it('«Смотреть все» раскрывает секцию до 9 карточек, повторный клик сворачивает', async () => {
      const { user } = renderWithProviders(<CatalogPage />, { preloadedState: withUsers })
      const toggle = within(screen.getByRole('region', { name: 'Популярное' })).getByRole(
        'button',
        { name: 'Смотреть все' },
      )

      await user.click(toggle)
      expect(cardsOf('Популярное')).toHaveLength(9)
      expect(cardsOf('Популярное')[8]).toHaveTextContent('Автор 3')
      expect(cardsOf('Новое')).toHaveLength(3)

      await user.click(toggle)
      expect(cardsOf('Популярное')).toHaveLength(3)
    })

    it('карточка может повторяться между секциями', () => {
      const one = createUser({ id: 'solo', name: 'Единственный' })
      renderWithProviders(<CatalogPage />, {
        preloadedState: { ...ready, users: { items: [one], status: 'succeeded', error: null } },
      })

      expect(cardsOf('Популярное')[0]).toHaveTextContent('Единственный')
      expect(cardsOf('Новое')[0]).toHaveTextContent('Единственный')
      expect(cardsOf('Рекомендуем')[0]).toHaveTextContent('Единственный')
    })
  })

  describe('загрузка обменов', () => {
    it('один раз загружает сохранённые обмены, в том числе в StrictMode', async () => {
      const load = vi.spyOn(exchanges, 'fetchExchanges')
      const { store } = renderWithProviders(
        <StrictMode>
          <CatalogPage />
        </StrictMode>,
      )
      expect(await screen.findByRole('heading', { name: 'Популярное' })).toBeInTheDocument()
      expect(load).toHaveBeenCalledTimes(1)
      expect(store.getState().exchanges.status).not.toBe('idle')
    })

    it('не перезапрашивает обмены, если они уже загружены', () => {
      const load = vi.spyOn(exchanges, 'fetchExchanges')
      renderWithProviders(<CatalogPage />, {
        preloadedState: {
          ...ready,
          exchanges: { items: [], status: 'succeeded', pendingRequests: 0, error: null },
        },
      })
      expect(screen.getByRole('heading', { name: 'Популярное' })).toBeInTheDocument()
      expect(load).not.toHaveBeenCalled()
    })

    it('ошибка загрузки обменов не прячет каталог', () => {
      renderWithProviders(<CatalogPage />, {
        preloadedState: {
          ...ready,
          exchanges: {
            items: [],
            status: 'failed',
            pendingRequests: 0,
            error: 'Не удалось загрузить обмены',
          },
        },
      })
      expect(screen.getByRole('heading', { name: 'Популярное' })).toBeInTheDocument()
      expect(screen.queryByRole('alert')).not.toBeInTheDocument()
    })
  })
})
