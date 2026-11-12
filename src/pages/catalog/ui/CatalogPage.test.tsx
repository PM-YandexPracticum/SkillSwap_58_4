import { screen } from '@testing-library/react'
import { renderWithProviders } from '@/app/test/renderWithProviders'
import { createUser } from '@/entities/user/testing'
import { CatalogPage } from './CatalogPage'

const ready: Partial<RootState> = {
  users: { items: [createUser()], status: 'succeeded', error: null },
  skills: { items: [], status: 'succeeded', error: null },
  categories: { items: [], status: 'succeeded' },
  cities: { items: [], status: 'succeeded' },
}

describe('CatalogPage', () => {
  it('показывает загруженные данные и единственную основную область', () => {
    const { store } = renderWithProviders(<CatalogPage />, { preloadedState: ready })
    expect(screen.getByRole('heading', { name: 'Популярное' })).toBeInTheDocument()
    expect(store.getState().users.items).toEqual(ready.users?.items)
    expect(screen.getAllByRole('main')).toHaveLength(1)
    expect(screen.getAllByRole('heading', { level: 1 })).toHaveLength(1)
    expect(screen.queryByRole('status', { name: 'Загрузка' })).not.toBeInTheDocument()
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
})
