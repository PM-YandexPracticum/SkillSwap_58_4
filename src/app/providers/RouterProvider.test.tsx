import { StrictMode } from 'react'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Provider } from 'react-redux'
import { ROUTES, STORAGE_KEYS } from '@/shared/config'

const fetchFromPublicDb = globalThis.fetch
// После resetModules весь lazy-маршрут собирается заново. В полном прогоне холодный импорт
// может занять больше стандартной секунды RTL; ждём сам заголовок, без фиксированной задержки.
const PAGE_READY_TIMEOUT = 5_000

async function openApp(path: string) {
  // loadSeed кеширует ответы на уровне модуля. Каждый запуск имитирует новую вкладку.
  vi.resetModules()
  const [{ createAppStore }, { AppRouter }, { ToastProvider }, users, skills, categories, cities] =
    await Promise.all([
      import('@/app/store'),
      import('./RouterProvider'),
      import('./ToastProvider'),
      import('@/entities/user'),
      import('@/entities/skill'),
      import('@/entities/category'),
      import('@/entities/city'),
    ])
  const loads = {
    users: vi.spyOn(users, 'fetchUsers'),
    skills: vi.spyOn(skills, 'fetchSkills'),
    categories: vi.spyOn(categories, 'fetchCategories'),
    cities: vi.spyOn(cities, 'fetchCities'),
  }
  window.history.replaceState(null, '', path)
  const store = createAppStore()
  render(
    <StrictMode>
      <Provider store={store}>
        <ToastProvider>
          <AppRouter />
        </ToastProvider>
      </Provider>
    </StrictMode>,
  )
  return { store, loads }
}

afterEach(() => {
  vi.restoreAllMocks()
  window.history.replaceState(null, '', '/')
})

describe('восстановление сессии при старте', { timeout: 20_000 }, () => {
  const origin = `${ROUTES.FAVORITES}?from=catalog#saved`

  it('сбрасывает сессию неизвестного пользователя и передаёт исходный адрес на вход', async () => {
    localStorage.setItem(STORAGE_KEYS.SESSION, JSON.stringify({ userId: 'missing', token: 'mock' }))
    const { store } = await openApp(origin)

    expect(
      await screen.findByRole('heading', { name: 'Вход' }, { timeout: PAGE_READY_TIMEOUT }),
    ).toBeInTheDocument()
    expect(window.location.pathname).toBe(ROUTES.LOGIN)
    expect(window.history.state.usr.from).toMatchObject({
      pathname: ROUTES.FAVORITES,
      search: '?from=catalog',
      hash: '#saved',
    })
    expect(store.getState().session.session).toBeNull()
    expect(localStorage.getItem(STORAGE_KEYS.SESSION)).toBeNull()
  })

  it('сохраняет известную сессию во время загрузки и после неё', async () => {
    const session = { userId: 'u01', token: 'mock' }
    localStorage.setItem(STORAGE_KEYS.SESSION, JSON.stringify(session))
    const { store } = await openApp(origin)

    expect(screen.getByRole('status', { name: 'Загрузка' })).toBeInTheDocument()
    expect(store.getState().session.session).toEqual(session)
    await waitFor(() => expect(store.getState().users.status).toBe('succeeded'))
    expect(
      await screen.findByRole(
        'heading',
        { name: 'Избранное', level: 1 },
        { timeout: PAGE_READY_TIMEOUT },
      ),
    ).toBeInTheDocument()
    expect(window.location.pathname).toBe(ROUTES.FAVORITES)
    expect(store.getState().session.session).toEqual(session)
    expect(localStorage.getItem(STORAGE_KEYS.SESSION)).toBe(JSON.stringify(session))
  })

  it('ошибка загрузки пользователей не завершает сохранённую сессию', async () => {
    const session = { userId: 'u01', token: 'mock' }
    localStorage.setItem(STORAGE_KEYS.SESSION, JSON.stringify(session))
    vi.spyOn(globalThis, 'fetch').mockImplementation((input, init) =>
      String(input).endsWith('/db/users.json')
        ? Promise.resolve(new Response('Unavailable', { status: 503 }))
        : fetchFromPublicDb(input, init),
    )
    const { store } = await openApp(origin)

    expect(
      await screen.findByRole(
        'heading',
        { name: 'На сервере произошла ошибка' },
        { timeout: PAGE_READY_TIMEOUT },
      ),
    ).toBeInTheDocument()
    await waitFor(() => {
      const { users, skills, categories, cities } = store.getState()
      expect([users.status, skills.status, categories.status, cities.status]).not.toContain(
        'loading',
      )
    })
    expect(store.getState().session.session).toEqual(session)
    expect(localStorage.getItem(STORAGE_KEYS.SESSION)).toBe(JSON.stringify(session))
  })
})

describe('стартовая загрузка', { timeout: 20_000 }, () => {
  it('загружает все четыре коллекции при прямом открытии входа', async () => {
    const { store, loads } = await openApp(ROUTES.LOGIN)

    expect(screen.getByRole('status', { name: 'Загрузка' })).toBeInTheDocument()
    expect(
      await screen.findByRole('heading', { name: 'Вход' }, { timeout: PAGE_READY_TIMEOUT }),
    ).toBeInTheDocument()
    const { users: loadedUsers, skills, categories, cities } = store.getState()
    expect([loadedUsers.status, skills.status, categories.status, cities.status]).toEqual([
      'succeeded',
      'succeeded',
      'succeeded',
      'succeeded',
    ])
    for (const load of Object.values(loads)) expect(load).toHaveBeenCalledTimes(1)
  })

  it.each(['users', 'skills', 'categories', 'cities'] as const)(
    'открывает 500 при ошибке %s.json и повторяет только упавшую загрузку',
    async (failedCollection) => {
      let collectionAvailable = false
      const fetchSeed = vi
        .spyOn(globalThis, 'fetch')
        .mockImplementation((input, init) =>
          String(input).endsWith(`/db/${failedCollection}.json`) && !collectionAvailable
            ? Promise.resolve(new Response('Not found', { status: 404 }))
            : fetchFromPublicDb(input, init),
        )
      const { store } = await openApp(ROUTES.LOGIN)
      const user = userEvent.setup()

      expect(
        await screen.findByRole(
          'heading',
          { name: 'На сервере произошла ошибка' },
          { timeout: PAGE_READY_TIMEOUT },
        ),
      ).toBeInTheDocument()
      expect(window.location.pathname).toBe(ROUTES.SERVER_ERROR)
      expect(store.getState()[failedCollection].status).toBe('failed')

      collectionAvailable = true
      await user.click(screen.getByRole('button', { name: 'На главную' }))
      expect(
        await screen.findByRole(
          'heading',
          { name: 'Каталог предложений' },
          { timeout: PAGE_READY_TIMEOUT },
        ),
      ).toBeInTheDocument()
      expect(window.location.pathname).toBe(ROUTES.HOME)
      expect(store.getState()[failedCollection].status).toBe('succeeded')

      await waitFor(() => expect(store.getState().exchanges.status).toBe('succeeded'))

      const urls = fetchSeed.mock.calls.map(([input]) => String(input))
      // Каталог отдельно загружает обмены; проверяем только четыре общие коллекции.
      for (const collection of ['users', 'skills', 'categories', 'cities']) {
        expect(urls.filter((url) => url.endsWith(`/db/${collection}.json`))).toHaveLength(
          collection === failedCollection ? 2 : 1,
        )
      }
    },
  )

  it('открывает страницу 500 напрямую без стартовой загрузки', async () => {
    const fetchSeed = vi.spyOn(globalThis, 'fetch')
    await openApp(ROUTES.SERVER_ERROR)

    expect(
      await screen.findByRole(
        'heading',
        { name: 'На сервере произошла ошибка' },
        { timeout: PAGE_READY_TIMEOUT },
      ),
    ).toBeInTheDocument()
    expect(fetchSeed).not.toHaveBeenCalled()
  })
})

describe('маршруты регистрации P6-01', { timeout: 20_000 }, () => {
  it.each([ROUTES.REGISTER_STEP_2, ROUTES.REGISTER_STEP_3])(
    'после открытия %s с новым store возвращает на шаг 1 и позволяет закрыть регистрацию',
    async (route) => {
      const { store } = await openApp(route)
      const user = userEvent.setup()
      expect(
        await screen.findByRole(
          'heading',
          { name: 'Регистрация', level: 1 },
          { timeout: PAGE_READY_TIMEOUT },
        ),
      ).toBeInTheDocument()
      await waitFor(() => expect(window.location.pathname).toBe(ROUTES.REGISTER_STEP_1))
      await user.click(screen.getByRole('button', { name: 'Закрыть' }))
      expect(
        await screen.findByRole(
          'heading',
          { name: 'Каталог предложений' },
          { timeout: PAGE_READY_TIMEOUT },
        ),
      ).toBeInTheDocument()
      expect(window.location.pathname).toBe(ROUTES.HOME)
      expect(store.getState().register.completedStep).toBe(0)
      await waitFor(() => expect(store.getState().exchanges.status).toBe('succeeded'))
    },
  )
})

describe('первый шаг регистрации P6-02', { timeout: 20_000 }, () => {
  it('сохраняет проверенные данные, открывает защищённый шаг 2, восстанавливает форму и очищает при выходе', async () => {
    const { store, loads } = await openApp(ROUTES.REGISTER_STEP_1)
    const user = userEvent.setup()
    await screen.findByRole('form', { name: 'Учётные данные' })
    const initialDraft = store.getState().register.draft

    expect(screen.getByRole('button', { name: 'Далее' })).toBeDisabled()
    await user.type(screen.getByLabelText('Email'), ' TEAMLEAD@example.com ')
    await user.type(screen.getByLabelText('Пароль'), 'Password123')
    await user.click(screen.getByRole('button', { name: 'Далее' }))

    expect(await screen.findByText('Шаг 2 из 3')).toBeInTheDocument()
    expect(window.location.pathname).toBe(ROUTES.REGISTER_STEP_2)
    expect(store.getState().register).toEqual({
      draft: { ...initialDraft, email: 'teamlead@example.com', password: 'Password123' },
      completedStep: 1,
      completionStatus: 'idle',
      completionError: null,
      completionRequestId: null,
    })
    for (const load of Object.values(loads)) expect(load).toHaveBeenCalledTimes(1)

    await user.click(screen.getByRole('button', { name: 'Назад' }))
    expect(await screen.findByLabelText('Email')).toHaveValue('teamlead@example.com')
    expect(screen.getByLabelText('Пароль')).toHaveValue('Password123')

    await user.click(screen.getByRole('button', { name: 'Закрыть' }))
    await screen.findByRole(
      'heading',
      { name: 'Каталог предложений' },
      { timeout: PAGE_READY_TIMEOUT },
    )
    await waitFor(() =>
      expect(store.getState().register).toEqual({
        draft: initialDraft,
        completedStep: 0,
        completionStatus: 'idle',
        completionError: null,
        completionRequestId: null,
      }),
    )
    await waitFor(() => expect(store.getState().exchanges.status).toBe('succeeded'))
  })
})
