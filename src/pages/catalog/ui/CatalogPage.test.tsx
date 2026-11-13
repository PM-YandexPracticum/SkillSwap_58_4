import { StrictMode } from 'react'
import { act, screen, waitFor, within } from '@testing-library/react'
import { renderWithProviders } from '@/app/test/renderWithProviders'
import { createSkill } from '@/entities/skill/testing'
import { fetchUsers } from '@/entities/user'
import * as exchanges from '@/entities/exchange'
import { createUser } from '@/entities/user/testing'
import { CatalogPage } from './CatalogPage'

const ready: Partial<RootState> = {
  users: {
    saveStatus: 'idle' as const,
    pendingSaves: 0,
    saveError: null,
    items: [createUser()],
    status: 'succeeded',
    error: null,
  },
  skills: {
    saveStatus: 'idle' as const,
    pendingSaves: 0,
    saveError: null,
    items: [],
    status: 'succeeded',
    error: null,
  },
  categories: { items: [], status: 'succeeded' },
  cities: { items: [], status: 'succeeded' },
  exchanges: { items: [], status: 'succeeded', pendingRequests: 0, error: null },
}

const cardsOf = (title: string) =>
  within(screen.getByRole('region', { name: title })).getAllByRole('article')

afterEach(() => vi.restoreAllMocks())

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
  renderWithProviders(<CatalogPage />, {
    preloadedState: {
      ...ready,
      catalogFilter: {
        mode: 'learn',
        subcategoryIds: [],
        gender: null,
        cityIds: [],
        sort: 'newest',
      },
    },
  })

  expect(screen.getByRole('heading', { name: 'Подходящие предложения: 1' })).toBeInTheDocument()
  expect(screen.getAllByRole('main')).toHaveLength(1)
  expect(
    screen.getByRole('heading', { level: 1, name: 'Каталог предложений' }),
  ).toBeInTheDocument()
})
  describe('секции «Популярное» и «Новое» (P5-04)', () => {
    // likesCount растёт с номером, дата регистрации — наоборот: Автор 0 самый новый.
    const items = Array.from({ length: 12 }, (_, i) =>
      createUser({
        id: `u${i}`,
        name: `Автор ${i}`,
        teachSkillId: `s${i}`,
        likesCount: i,
        createdAt: new Date(Date.UTC(2026, 0, 20 - i)).toISOString(),
      }),
    )
    const withUsers: Partial<RootState> = {
      ...ready,
      users: {
        saveStatus: 'idle' as const,
        pendingSaves: 0,
        saveError: null,
        items,
        status: 'succeeded',
        error: null,
      },
      skills: {
        saveStatus: 'idle' as const,
        pendingSaves: 0,
        saveError: null,
        items: items.map((u) => createSkill({ id: u.teachSkillId, authorId: u.id })),
        status: 'succeeded',
        error: null,
      },
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

    it('пересчитывает популярное после изменения данных, сохраняя порядок рекомендаций', () => {
      const { store } = renderWithProviders(<CatalogPage />, { preloadedState: withUsers })
      act(() => {
        store.dispatch(
          fetchUsers.fulfilled(
            items.map((u) => (u.id === 'u0' ? { ...u, likesCount: 100 } : u)),
            'updated',
            undefined,
          ),
        )
      })
      expect(cardsOf('Популярное')[0]).toHaveTextContent('Автор 0')
      expect(cardsOf('Рекомендуем')[1]).toHaveTextContent('Автор 1')
    })

    it('карточка может повторяться между секциями', () => {
      const one = createUser({ id: 'solo', name: 'Единственный' })
      renderWithProviders(<CatalogPage />, {
        preloadedState: {
          ...ready,
          users: {
            saveStatus: 'idle' as const,
            pendingSaves: 0,
            saveError: null,
            items: [one],
            status: 'succeeded',
            error: null,
          },
        },
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
        {
          preloadedState: {
            ...ready,
            exchanges: { items: [], status: 'idle', pendingRequests: 0, error: null },
          },
        },
      )
      expect(await screen.findByRole('heading', { name: 'Популярное' })).toBeInTheDocument()
      expect(load).toHaveBeenCalledTimes(1)
      await waitFor(() => expect(store.getState().exchanges.status).toBe('succeeded'))
    })

    it.each(['loading', 'succeeded', 'failed'] as const)(
      'не запускает обмены повторно при статусе %s',
      (status) => {
        const load = vi.spyOn(exchanges, 'fetchExchanges')
        renderWithProviders(<CatalogPage />, {
          preloadedState: {
            ...ready,
            exchanges: {
              items: [],
              status,
              pendingRequests: status === 'loading' ? 1 : 0,
              error: null,
            },
          },
        })
        expect(screen.getByRole('heading', { name: 'Популярное' })).toBeInTheDocument()
        expect(load).not.toHaveBeenCalled()
      },
    )

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
