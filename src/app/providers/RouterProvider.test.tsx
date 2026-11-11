import { StrictMode } from 'react'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Provider } from 'react-redux'
import { ROUTES } from '@/shared/config'

const fetchFromPublicDb = globalThis.fetch

async function openApp(path: string) {
  // loadSeed кеширует ответы на уровне модуля. Каждый запуск имитирует новую вкладку.
  vi.resetModules()
  const [{ createAppStore }, { AppRouter }, users] = await Promise.all([
    import('@/app/store'),
    import('./RouterProvider'),
    import('@/entities/user'),
  ])
  const loadUsers = vi.spyOn(users, 'fetchUsers')
  window.history.replaceState(null, '', path)
  const store = createAppStore()
  render(
    <StrictMode>
      <Provider store={store}>
        <AppRouter />
      </Provider>
    </StrictMode>,
  )
  return { store, loadUsers }
}

afterEach(() => {
  vi.restoreAllMocks()
  window.history.replaceState(null, '', '/')
})

describe('стартовая загрузка', { timeout: 20_000 }, () => {
  it('загружает все четыре коллекции при прямом открытии входа', async () => {
    const { store, loadUsers } = await openApp(ROUTES.LOGIN)

    expect(screen.getByRole('status', { name: 'Загрузка' })).toBeInTheDocument()
    expect(await screen.findByRole('heading', { name: 'Вход' })).toBeInTheDocument()
    const { users: loadedUsers, skills, categories, cities } = store.getState()
    expect([loadedUsers.status, skills.status, categories.status, cities.status]).toEqual([
      'succeeded',
      'succeeded',
      'succeeded',
      'succeeded',
    ])
    expect(loadUsers).toHaveBeenCalledTimes(1)
  })

  it('открывает 500 при ошибке users.json и повторяет только упавшую загрузку по кнопке «На главную»', async () => {
    let usersAvailable = false
    const fetchSeed = vi
      .spyOn(globalThis, 'fetch')
      .mockImplementation((input, init) =>
        String(input).endsWith('/db/users.json') && !usersAvailable
          ? Promise.resolve(new Response('Not found', { status: 404 }))
          : fetchFromPublicDb(input, init),
      )
    const { store } = await openApp(ROUTES.LOGIN)
    const user = userEvent.setup()

    expect(
      await screen.findByRole('heading', { name: 'На сервере произошла ошибка' }),
    ).toBeInTheDocument()
    expect(window.location.pathname).toBe(ROUTES.SERVER_ERROR)
    expect(store.getState().users.status).toBe('failed')

    usersAvailable = true
    await user.click(screen.getByRole('button', { name: 'На главную' }))
    expect(await screen.findByRole('heading', { name: 'Каталог предложений' })).toBeInTheDocument()
    expect(window.location.pathname).toBe(ROUTES.HOME)
    expect(store.getState().users.status).toBe('succeeded')
    expect(fetchSeed.mock.calls.map(([input]) => String(input)).sort()).toEqual([
      '/db/categories.json',
      '/db/cities.json',
      '/db/skills.json',
      '/db/users.json',
      '/db/users.json',
    ])
  })

  it('открывает страницу 500 напрямую без стартовой загрузки', async () => {
    const fetchSeed = vi.spyOn(globalThis, 'fetch')
    await openApp(ROUTES.SERVER_ERROR)

    expect(
      await screen.findByRole('heading', { name: 'На сервере произошла ошибка' }),
    ).toBeInTheDocument()
    expect(fetchSeed).not.toHaveBeenCalled()
  })
})
