import { StrictMode } from 'react'
import { screen } from '@testing-library/react'
import { renderWithProviders } from '@/app/test/renderWithProviders'
import * as categories from '@/entities/category'
import * as cities from '@/entities/city'
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
})
