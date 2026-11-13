import { act, screen, waitFor, within } from '@testing-library/react'
import { Route, Routes, useLocation, type Location } from 'react-router-dom'

import { renderWithProviders } from '@/app/test/renderWithProviders'
import type { Category } from '@/entities/category'
import { selectNotifications, type Notification } from '@/entities/notification'
import { fetchExchanges, type Exchange } from '@/entities/exchange'
import * as skills from '@/entities/skill'
import { createSkill } from '@/entities/skill/testing'
import * as users from '@/entities/user'
import { createUser } from '@/entities/user/testing'
import { endSession } from '@/entities/session'
import { getSkillRoute, ROUTES } from '@/shared/config'

import { SkillPage } from './SkillPage'

const { createNotificationMock } = vi.hoisted(() => ({
  createNotificationMock: vi.fn(),
}))

vi.mock('@/entities/notification/api/notificationApi', async () => {
  const actual = await vi.importActual<
    typeof import('@/entities/notification/api/notificationApi')
  >('@/entities/notification/api/notificationApi')
  return {
    ...actual,
    ensureExchangeNotification: async (notification: Notification) => {
      await createNotificationMock(notification)
      return actual.ensureExchangeNotification(notification)
    },
  }
})

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
  users: {
    saveStatus: 'idle' as const,
    pendingSaves: 0,
    saveError: null,
    items: [author, similarUser],
    status: 'succeeded' as const,
    error: null,
  },
  skills: {
    saveStatus: 'idle' as const,
    pendingSaves: 0,
    saveError: null,
    items: [skill, similarSkill, skillWithoutSimilar],
    status: 'succeeded' as const,
    error: null,
  },
  categories: { items: categories, status: 'succeeded' as const },
  cities: { items: [{ id: 'spb', name: 'Санкт-Петербург' }], status: 'succeeded' as const },
  exchanges: {
    items: [] as Exchange[],
    status: 'succeeded' as 'idle' | 'loading' | 'succeeded' | 'failed',
    pendingRequests: 0,
    error: null,
  },
  notifications: {
    items: [] as Notification[],
    status: 'succeeded' as const,
    pendingRequests: 0,
    error: null,
  },
}

const authenticatedState = {
  ...preloadedState,
  session: { session: { userId: 'u99', token: 'test-token' } },
}

beforeEach(() => {
  vi.spyOn(window, 'scrollTo').mockImplementation(() => {})
  createNotificationMock.mockReset()
})
afterEach(() => vi.restoreAllMocks())

function LoginDestination() {
  const from = (useLocation().state as { from?: Location } | null)?.from
  return (
    <>
      <h1>Вход</h1>
      <p>{from ? `${from.pathname}${from.search}${from.hash}` : 'Нет адреса возврата'}</p>
    </>
  )
}

function renderSkillPage(skillId: string, state = preloadedState, route = getSkillRoute(skillId)) {
  return renderWithProviders(
    <Routes>
      <Route path={ROUTES.SKILL} element={<SkillPage />} />
      <Route path={ROUTES.LOGIN} element={<LoginDestination />} />
    </Routes>,
    { route, preloadedState: state },
  )
}

describe('SkillPage', () => {
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

  it('«Подробнее» открывает похожий навык и пересчитывает список без нового автора', async () => {
    const { user } = renderSkillPage('s01')
    const section = screen.getByRole('region', { name: 'Похожие предложения' })

    await user.click(within(section).getByRole('link', { name: 'Подробнее' }))

    expect(screen.getByRole('heading', { level: 1, name: 'Игра на гитаре' })).toBeInTheDocument()
    const nextSection = screen.getByRole('region', { name: 'Похожие предложения' })
    expect(within(nextSection).getByRole('heading', { name: 'Иван' })).toBeInTheDocument()
    expect(within(nextSection).queryByRole('heading', { name: 'Наталья' })).not.toBeInTheDocument()
  })

  it('при переходе на похожий навык возвращает прокрутку и фокус к началу страницы', async () => {
    const { user } = renderSkillPage('s01')
    vi.mocked(window.scrollTo).mockClear()
    const section = screen.getByRole('region', { name: 'Похожие предложения' })

    await user.click(within(section).getByRole('link', { name: 'Подробнее' }))

    expect(screen.getByRole('main', { name: similarSkill.title })).toHaveFocus()
    expect(window.scrollTo).toHaveBeenCalledWith({ top: 0, left: 0, behavior: 'instant' })
  })

  it('обновление данных того же навыка не забирает фокус и не сбрасывает прокрутку', () => {
    const { store } = renderSkillPage('s01')
    const detailsLink = within(
      screen.getByRole('region', { name: 'Похожие предложения' }),
    ).getByRole('link', { name: 'Подробнее' })
    detailsLink.focus()
    vi.mocked(window.scrollTo).mockClear()

    act(() => {
      store.dispatch(
        users.fetchUsers.fulfilled([{ ...author, about: 'Новый текст' }, similarUser], 'reload'),
      )
    })

    expect(detailsLink).toHaveFocus()
    expect(window.scrollTo).not.toHaveBeenCalled()
  })

  it('скрывает блок, если после обновления навыков совпадений больше нет', () => {
    const { store } = renderSkillPage('s01')
    expect(screen.getByRole('region', { name: 'Похожие предложения' })).toBeInTheDocument()

    act(() => {
      store.dispatch(
        skills.fetchSkills.fulfilled(
          [skill, { ...similarSkill, subcategoryId: 'time' }, skillWithoutSimilar],
          'reload',
        ),
      )
    })

    expect(screen.queryByRole('region', { name: 'Похожие предложения' })).not.toBeInTheDocument()
    expect(screen.getByRole('heading', { level: 1, name: skill.title })).toBeInTheDocument()
  })

  it('показывает блок, когда в store появляется подходящий автор', () => {
    const { store } = renderSkillPage('s01', {
      ...preloadedState,
      users: { ...preloadedState.users, items: [author] },
    })
    expect(screen.queryByRole('region', { name: 'Похожие предложения' })).not.toBeInTheDocument()

    act(() => {
      store.dispatch(users.fetchUsers.fulfilled([author, similarUser], 'reload'))
    })

    const section = screen.getByRole('region', { name: 'Похожие предложения' })
    expect(within(section).getByRole('heading', { name: similarUser.name })).toBeInTheDocument()
  })

  it('гость переходит на вход с адресом страницы навыка для возврата', async () => {
    const returnTo = '/skill/s01?from=catalog#gallery'
    const { user } = renderSkillPage('s01', preloadedState, returnTo)

    await user.click(await screen.findByRole('button', { name: 'Предложить обмен' }))

    expect(await screen.findByRole('heading', { name: 'Вход' })).toBeInTheDocument()
    expect(screen.getByText(returnTo)).toBeInTheDocument()
  })

  it('создаёт обмен и уведомление, показывает toast и окно подтверждения', async () => {
    const { user, store } = renderSkillPage('s01', authenticatedState)
    await user.click(await screen.findByRole('button', { name: 'Предложить обмен' }))

    expect(
      await screen.findByRole('dialog', { name: 'Вы предложили обмен' }, { timeout: 4000 }),
    ).toBeInTheDocument()
    expect(screen.getByText('Вы предложили обмен Ивану')).toBeInTheDocument()
    expect(
      store.getState().exchanges.items.filter((item) => item.fromUserId === 'u99'),
    ).toHaveLength(1)
    expect(
      store.getState().exchanges.items.find((item) => item.fromUserId === 'u99'),
    ).toMatchObject({
      fromUserId: 'u99',
      toUserId: author.id,
      skillId: skill.id,
    })
    expect(selectNotifications(store.getState())).toHaveLength(1)

    await user.click(screen.getByRole('button', { name: 'Готово' }))

    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Обмен предложен' })).toBeDisabled()
    expect(screen.queryByRole('button', { name: 'Предложить обмен' })).not.toBeInTheDocument()
  })

  it('закрытие модалки через Escape не отменяет уже сохранённый обмен', async () => {
    const { user } = renderSkillPage('s01', authenticatedState)
    await user.click(await screen.findByRole('button', { name: 'Предложить обмен' }))
    await screen.findByRole('dialog', { name: 'Вы предложили обмен' }, { timeout: 4000 })

    await user.keyboard('{Escape}')

    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Обмен предложен' })).toBeDisabled()
  })

  it('после сбоя уведомления повторяет только недостающую запись', async () => {
    createNotificationMock.mockRejectedValueOnce(new Error('temporary failure'))
    const { user, store } = renderSkillPage('s01', authenticatedState)

    await user.click(await screen.findByRole('button', { name: 'Предложить обмен' }))
    expect(await screen.findByRole('alert', undefined, { timeout: 4000 })).toHaveTextContent(
      'Не удалось сохранить уведомление',
    )
    expect(
      store.getState().exchanges.items.filter((item) => item.fromUserId === 'u99'),
    ).toHaveLength(1)
    expect(selectNotifications(store.getState())).toHaveLength(0)
    expect(screen.getByRole('button', { name: 'Предложить обмен' })).toBeEnabled()

    await user.click(screen.getByRole('button', { name: 'Предложить обмен' }))
    expect(
      await screen.findByRole('dialog', { name: 'Вы предложили обмен' }, { timeout: 4000 }),
    ).toBeInTheDocument()
    expect(
      store.getState().exchanges.items.filter((item) => item.fromUserId === 'u99'),
    ).toHaveLength(1)
    expect(selectNotifications(store.getState())).toHaveLength(1)
    expect(createNotificationMock).toHaveBeenCalledTimes(2)
  })

  it('после сбоя уведомления и нового store позволяет завершить обмен без дубля', async () => {
    createNotificationMock.mockRejectedValueOnce(new Error('temporary failure'))
    const first = renderSkillPage('s01', authenticatedState)
    await first.user.click(screen.getByRole('button', { name: 'Предложить обмен' }))
    await screen.findByRole('alert', undefined, { timeout: 4000 })
    first.unmount()

    const reloaded = renderSkillPage('s01', {
      ...authenticatedState,
      exchanges: { ...authenticatedState.exchanges, status: 'idle' },
    })
    await waitFor(() => expect(reloaded.store.getState().exchanges.status).toBe('succeeded'))
    expect(screen.getByRole('button', { name: 'Предложить обмен' })).toBeEnabled()
    await reloaded.user.click(screen.getByRole('button', { name: 'Предложить обмен' }))
    await screen.findByRole('dialog', { name: 'Вы предложили обмен' }, { timeout: 4000 })
    expect(
      reloaded.store.getState().exchanges.items.filter((item) => item.fromUserId === 'u99'),
    ).toHaveLength(1)
    expect(selectNotifications(reloaded.store.getState())).toHaveLength(1)
  })

  it.each(['success', 'failure'] as const)(
    'ответ %s от предыдущего навыка не меняет новую страницу',
    async (outcome) => {
      let finish!: () => Promise<void>
      createNotificationMock.mockImplementationOnce(
        () =>
          new Promise<void>((resolve, reject) => {
            finish = async () => {
              if (outcome === 'failure') reject(new Error('temporary failure'))
              else resolve()
            }
          }),
      )
      const { user, store } = renderSkillPage('s01', authenticatedState)
      await user.click(screen.getByRole('button', { name: 'Предложить обмен' }))
      await waitFor(() => expect(createNotificationMock).toHaveBeenCalledTimes(1), {
        timeout: 3000,
      })
      await user.click(
        within(screen.getByRole('region', { name: 'Похожие предложения' })).getByRole('link', {
          name: 'Подробнее',
        }),
      )
      expect(
        screen.getByRole('heading', { level: 1, name: similarSkill.title }),
      ).toBeInTheDocument()
      await act(async () => {
        await finish()
      })
      await waitFor(() => expect(store.getState().notifications.pendingRequests).toBe(0))
      // Даём завершиться всей операции, включая подтверждение записи обмена.
      await act(async () => {
        await store.dispatch(fetchExchanges()).unwrap()
      })
      expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
      expect(screen.queryByRole('alert')).not.toBeInTheDocument()
      expect(screen.queryByText('Вы предложили обмен Ивану')).not.toBeInTheDocument()
      expect(screen.getByRole('button', { name: 'Предложить обмен' })).toBeEnabled()
    },
  )

  it('выход во время записи не показывает результат предыдущей сессии', async () => {
    let finish!: () => void
    createNotificationMock.mockImplementationOnce(
      () =>
        new Promise<void>((resolve) => {
          finish = resolve
        }),
    )
    const { user, store } = renderSkillPage('s01', authenticatedState)
    await user.click(screen.getByRole('button', { name: 'Предложить обмен' }))
    await waitFor(() => expect(createNotificationMock).toHaveBeenCalledTimes(1), { timeout: 3000 })
    act(() => {
      store.dispatch(endSession())
    })
    await act(async () => {
      finish()
    })
    await waitFor(() => expect(store.getState().notifications.pendingRequests).toBe(0))
    await act(async () => {
      await store.dispatch(fetchExchanges()).unwrap()
    })
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
    expect(screen.queryByRole('alert')).not.toBeInTheDocument()
    expect(screen.queryByText('Вы предложили обмен Ивану')).not.toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Предложить обмен' })).toBeEnabled()
  })

  it('не показывает активную кнопку, если обмен этому автору уже есть в store', async () => {
    const exchange: Exchange = {
      id: 'e-existing',
      fromUserId: 'u99',
      toUserId: author.id,
      skillId: skill.id,
      createdAt: '2026-11-12T10:00:00.000Z',
    }
    renderSkillPage('s01', {
      ...authenticatedState,
      exchanges: { ...authenticatedState.exchanges, items: [exchange] },
    })

    expect(await screen.findByRole('button', { name: 'Обмен предложен' })).toBeDisabled()
    expect(screen.queryByRole('button', { name: 'Предложить обмен' })).not.toBeInTheDocument()
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
          users: {
            saveStatus: 'idle' as const,
            pendingSaves: 0,
            saveError: null,
            items: [],
            status: 'failed',
            error: 'Не удалось загрузить пользователей',
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
        users: {
          saveStatus: 'idle' as const,
          pendingSaves: 0,
          saveError: null,
          items: [],
          status: 'loading',
          error: null,
        },
        skills: {
          saveStatus: 'idle' as const,
          pendingSaves: 0,
          saveError: null,
          items: [],
          status: 'loading',
          error: null,
        },
        categories: { items: [], status: 'loading' },
        cities: { items: [], status: 'loading' },
      },
    })

    expect(screen.getByRole('status', { name: 'Загрузка' })).toBeInTheDocument()
    expect(window.scrollTo).not.toHaveBeenCalled()
  })
})
