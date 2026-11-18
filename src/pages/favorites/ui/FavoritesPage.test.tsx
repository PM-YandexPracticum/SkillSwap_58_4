import { StrictMode } from 'react'
import { Route, Routes } from 'react-router-dom'
import { act, fireEvent, screen, waitFor, within } from '@testing-library/react'
import { afterEach, describe, expect, it, vi } from 'vitest'

import { renderWithProviders } from '@/app/test/renderWithProviders'
import { createExchange } from '@/entities/exchange'
import { createSkill } from '@/entities/skill/testing'
import { createUser as saveUser, fetchUsers, getUserById } from '@/entities/user'
import { createUser } from '@/entities/user/testing'
import { CATALOG, ROUTES } from '@/shared/config'
import { FavoritesPage } from './FavoritesPage'

const createReadyState = (favoriteCount = 2): Partial<RootState> => {
  const favoriteUsers = Array.from({ length: favoriteCount }, (_, index) =>
    createUser({
      id: `u${index + 2}`,
      name: `Избранный пользователь ${index + 1}`,
    }),
  )

  const currentUser = createUser({
    id: 'u1',
    name: 'Текущий пользователь',
    likedUserIds: favoriteUsers.map((user) => user.id),
  })

  const ordinaryUser = createUser({
    id: 'u100',
    name: 'Обычный пользователь',
  })

  return {
    session: {
      session: {
        userId: 'u1',
        token: 'test-token',
      },
    },
    users: {
      saveStatus: 'idle',
      pendingSaves: 0,
      saveError: null,
      items: [currentUser, ...favoriteUsers, ordinaryUser],
      status: 'succeeded',
      error: null,
    },
    skills: {
      saveStatus: 'idle',
      pendingSaves: 0,
      saveError: null,
      items: [],
      status: 'succeeded',
      error: null,
    },
    categories: {
      items: [],
      status: 'succeeded',
    },
    cities: {
      items: [],
      status: 'succeeded',
    },
    exchanges: {
      items: [],
      status: 'succeeded',
      pendingRequests: 0,
      error: null,
    },
  }
}

const cardsOf = () =>
  within(screen.getByRole('region', { name: 'Избранное' })).queryAllByRole('article')

afterEach(() => vi.restoreAllMocks())

describe('FavoritesPage', () => {
  it('показывает только пользователей, добавленных в избранное', () => {
    renderWithProviders(<FavoritesPage />, {
      preloadedState: createReadyState(),
    })

    const cards = cardsOf()

    expect(cards).toHaveLength(2)
    expect(cards[0]).toHaveTextContent('Избранный пользователь 1')
    expect(cards[1]).toHaveTextContent('Избранный пользователь 2')
    expect(screen.queryByText('Обычный пользователь')).not.toBeInTheDocument()
    expect(screen.getAllByRole('main')).toHaveLength(1)
    expect(screen.getAllByRole('heading', { name: 'Избранное', level: 1 })).toHaveLength(1)
  })

  it('сохраняет порядок пользователей из store', () => {
    const ready = createReadyState(3)

    renderWithProviders(<FavoritesPage />, {
      preloadedState: ready,
    })

    const cards = cardsOf()

    expect(cards).toHaveLength(3)
    expect(cards[0]).toHaveTextContent('Избранный пользователь 1')
    expect(cards[1]).toHaveTextContent('Избранный пользователь 2')
    expect(cards[2]).toHaveTextContent('Избранный пользователь 3')
  })

  it('берёт избранное именно текущего пользователя', () => {
    const currentUser = createUser({
      id: 'u1',
      name: 'Текущий пользователь',
      likedUserIds: ['u2'],
    })

    const otherUser = createUser({
      id: 'u200',
      name: 'Другой пользователь',
      likedUserIds: ['u3'],
    })

    const myFavorite = createUser({
      id: 'u2',
      name: 'Мой избранный пользователь',
    })

    const otherFavorite = createUser({
      id: 'u3',
      name: 'Чужой избранный пользователь',
    })

    const ready = createReadyState()

    renderWithProviders(<FavoritesPage />, {
      preloadedState: {
        ...ready,
        users: {
          ...ready.users!,
          items: [currentUser, otherUser, myFavorite, otherFavorite],
        },
      },
    })

    const cards = cardsOf()

    expect(cards).toHaveLength(1)
    expect(cards[0]).toHaveTextContent('Мой избранный пользователь')
    expect(screen.queryByText('Чужой избранный пользователь')).not.toBeInTheDocument()
  })

  it('показывает пустое состояние и позволяет вернуться в каталог', async () => {
    const { user } = renderWithProviders(
      <Routes>
        <Route path={ROUTES.FAVORITES} element={<FavoritesPage />} />
        <Route path={ROUTES.HOME} element={<h1>Каталог предложений</h1>} />
      </Routes>,
      { preloadedState: createReadyState(0), route: ROUTES.FAVORITES },
    )

    expect(cardsOf()).toHaveLength(0)
    expect(screen.getByRole('status')).toHaveTextContent('В избранном пока нет предложений')
    await user.click(screen.getByRole('button', { name: 'Вернуться в каталог' }))
    expect(screen.getByRole('heading', { name: 'Каталог предложений' })).toBeInTheDocument()
  })

  it.each(['Сбросить', 'Сбросить поиск и фильтры'])(
    'кнопка «%s» очищает поиск и фильтры, возвращая избранное',
    async (buttonName) => {
      const { store, user } = renderWithProviders(<FavoritesPage />, {
        preloadedState: {
          ...createReadyState(),
          search: { query: 'нет такого навыка' },
          catalogFilter: {
            mode: 'all',
            subcategoryIds: [],
            gender: 'female',
            cityIds: [],
            sort: 'newest',
          },
        },
      })

      expect(cardsOf()).toHaveLength(0)
      expect(screen.getByRole('status')).toHaveTextContent(
        'По выбранным фильтрам ничего не найдено',
      )
      expect(screen.queryByRole('button', { name: 'Вернуться в каталог' })).not.toBeInTheDocument()
      await user.click(screen.getByRole('button', { name: new RegExp(`^${buttonName}$`) }))
      expect(cardsOf()).toHaveLength(2)
      expect(store.getState().search.query).toBe('')
      expect(screen.getByRole('radio', { name: 'Не имеет значения' })).toBeChecked()
      expect(screen.queryByRole('status')).not.toBeInTheDocument()
    },
  )

  it('комбинирует поиск и фильтры только внутри избранного', async () => {
    const ready = createReadyState()
    const { user } = renderWithProviders(<FavoritesPage />, {
      preloadedState: {
        ...ready,
        users: {
          ...ready.users!,
          items: ready.users!.items.map((item) => ({ ...item, teachSkillId: item.id })),
        },
        skills: {
          ...ready.skills!,
          items: ready.users!.items.map((item) =>
            createSkill({
              id: item.id,
              authorId: item.id,
              title: item.id === 'u3' ? 'Рисование' : 'Игра на барабанах',
            }),
          ),
        },
        search: { query: 'барабан' },
      },
    })

    expect(cardsOf()).toHaveLength(1)
    expect(cardsOf()[0]).toHaveTextContent('Избранный пользователь 1')
    await user.click(screen.getByRole('radio', { name: 'Женский' }))
    expect(cardsOf()).toHaveLength(0)
    await user.click(screen.getByRole('radio', { name: 'Мужской' }))
    expect(cardsOf()).toHaveLength(1)
  })

  it('после снятия последнего лайка показывает пустое состояние и сохраняет изменение', async () => {
    const owner = createUser({
      id: 'favorites-owner',
      email: 'owner@example.com',
      likedUserIds: ['favorites-target'],
    })
    const target = createUser({ id: 'favorites-target', email: 'target@example.com' })
    await Promise.all([saveUser(owner), saveUser(target)])
    const ready = createReadyState()
    const { user } = renderWithProviders(<FavoritesPage />, {
      preloadedState: {
        ...ready,
        session: { session: { userId: owner.id, token: 'test-token' } },
        users: { ...ready.users!, items: [owner, target] },
      },
    })

    await user.click(screen.getByRole('button', { name: 'Убрать из избранного' }))
    expect(await screen.findByRole('status')).toHaveTextContent('В избранном пока нет предложений')
    expect(cardsOf()).toHaveLength(0)
    expect((await getUserById(owner.id))?.likedUserIds).toEqual([])
    expect((await getUserById(target.id))?.likesCount).toBe(target.likesCount - 1)
  })

  it('при прямом входе загружает сохранённый обмен один раз в StrictMode', async () => {
    await createExchange({
      id: 'favorite-exchange',
      fromUserId: 'u1',
      toUserId: 'u2',
      skillId: 's-test',
      createdAt: '2026-11-18T10:00:00.000Z',
    })
    const { store } = renderWithProviders(
      <StrictMode>
        <FavoritesPage />
      </StrictMode>,
      {
        preloadedState: {
          ...createReadyState(1),
          exchanges: { items: [], status: 'idle', pendingRequests: 0, error: null },
        },
        route: ROUTES.FAVORITES,
      },
    )

    expect(store.getState().exchanges.pendingRequests).toBe(1)
    await waitFor(() => expect(store.getState().exchanges.status).toBe('succeeded'))
    expect(screen.getByText('Обмен предложен')).toBeInTheDocument()
    expect(screen.queryByRole('link', { name: 'Подробнее' })).not.toBeInTheDocument()
  })

  it('не показывает избранных пользователей гостю', () => {
    const ready = createReadyState()

    renderWithProviders(<FavoritesPage />, {
      preloadedState: {
        ...ready,
        session: {
          session: null,
        },
      },
    })

    expect(cardsOf()).toHaveLength(0)
  })

  it('не показывает карточки для ID, которых нет среди пользователей', () => {
    const ready = createReadyState(1)

    const users = ready.users!.items.map((user) =>
      user.id === 'u1' ? { ...user, likedUserIds: ['u2', 'missing-user'] } : user,
    )

    renderWithProviders(<FavoritesPage />, {
      preloadedState: {
        ...ready,
        users: {
          ...ready.users!,
          items: users,
        },
      },
    })

    const cards = cardsOf()

    expect(cards).toHaveLength(1)
    expect(cards[0]).toHaveTextContent('Избранный пользователь 1')
  })

  it('обновляет карточки после изменения списка избранного в store', () => {
    const ready = createReadyState(2)

    const { store } = renderWithProviders(<FavoritesPage />, {
      preloadedState: ready,
    })

    expect(cardsOf()).toHaveLength(2)

    const updatedUsers = ready.users!.items.map((user) =>
      user.id === 'u1' ? { ...user, likedUserIds: ['u3', 'u100'] } : user,
    )

    act(() => {
      store.dispatch(fetchUsers.fulfilled(updatedUsers, 'updated', undefined))
    })

    const cards = cardsOf()

    expect(cards).toHaveLength(2)
    expect(cards[0]).toHaveTextContent('Избранный пользователь 2')
    expect(cards[1]).toHaveTextContent('Обычный пользователь')
    expect(screen.queryByText('Избранный пользователь 1')).not.toBeInTheDocument()
  })

  it('показывает первые 6 карточек при большом количестве избранных', () => {
    renderWithProviders(<FavoritesPage />, {
      preloadedState: createReadyState(8),
    })

    const cards = cardsOf()

    expect(cards).toHaveLength(CATALOG.SCROLL_BATCH)
    expect(cards[0]).toHaveTextContent('Избранный пользователь 1')
    expect(cards[5]).toHaveTextContent('Избранный пользователь 6')
  })

  it('догружает следующую порцию карточек при достижении конца списка', () => {
    class ObserverMock {
      static instances: ObserverMock[] = []

      target: Element | null = null

      constructor(private readonly callback: IntersectionObserverCallback) {
        ObserverMock.instances.push(this)
      }

      observe = (target: Element) => {
        this.target = target
      }

      disconnect = () => undefined

      intersect() {
        act(() => {
          this.callback(
            [
              {
                target: this.target,
                isIntersecting: true,
              } as IntersectionObserverEntry,
            ],
            this as unknown as IntersectionObserver,
          )
        })
      }
    }

    vi.useFakeTimers()
    vi.stubGlobal('IntersectionObserver', ObserverMock)

    try {
      renderWithProviders(<FavoritesPage />, {
        preloadedState: createReadyState(8),
      })

      expect(cardsOf()).toHaveLength(CATALOG.SCROLL_BATCH)

      fireEvent.wheel(window)
      fireEvent.scroll(window)

      ObserverMock.instances[0]!.intersect()

      act(() => {
        vi.advanceTimersByTime(CATALOG.SCROLL_DELAY_MS)
      })

      expect(cardsOf()).toHaveLength(8)
      expect(cardsOf()[7]).toHaveTextContent('Избранный пользователь 8')
    } finally {
      vi.clearAllTimers()
      vi.useRealTimers()
      vi.unstubAllGlobals()
    }
  })
})
