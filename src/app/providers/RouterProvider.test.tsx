import { StrictMode } from 'react'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Provider } from 'react-redux'
import { ROUTES } from '@/shared/config'

const fetchFromPublicDb = globalThis.fetch

async function openApp(path: string) {
  // loadSeed кеширует ответы на уровне модуля. Каждый запуск имитирует новую вкладку.
  vi.resetModules()
  const [{ createAppStore }, { AppRouter }, users, skills, categories, cities] = await Promise.all([
    import('@/app/store'),
    import('./RouterProvider'),
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
        <AppRouter />
      </Provider>
    </StrictMode>,
  )
  return { store, loads }
}

afterEach(() => {
  vi.restoreAllMocks()
  window.history.replaceState(null, '', '/')
})

describe('стартовая загрузка', { timeout: 20_000 }, () => {
  it('загружает все четыре коллекции при прямом открытии входа', async () => {
    const { store, loads } = await openApp(ROUTES.LOGIN)

    expect(screen.getByRole('status', { name: 'Загрузка' })).toBeInTheDocument()
    expect(await screen.findByRole('heading', { name: 'Вход' })).toBeInTheDocument()
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
        await screen.findByRole('heading', { name: 'На сервере произошла ошибка' }),
      ).toBeInTheDocument()
      expect(window.location.pathname).toBe(ROUTES.SERVER_ERROR)
      expect(store.getState()[failedCollection].status).toBe('failed')

      collectionAvailable = true
      await user.click(screen.getByRole('button', { name: 'На главную' }))
      expect(
        await screen.findByRole('heading', { name: 'Каталог предложений' }),
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
      await screen.findByRole('heading', { name: 'На сервере произошла ошибка' }),
    ).toBeInTheDocument()
    expect(fetchSeed).not.toHaveBeenCalled()
  })
})
