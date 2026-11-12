import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { useToast } from '@/shared/lib/toast'
import * as storeProvider from './providers/StoreProvider'
import * as themeProvider from './providers/ThemeProvider'
import * as toastProvider from './providers/ToastProvider'
import { App } from './App'

const failures = vi.hoisted(() => ({ route: false }))

vi.mock('./providers/RouterProvider', () => ({
  AppRouter: function Probe() {
    const { showToast } = useToast()
    if (failures.route) throw new Error('Ошибка страницы')
    return <button onClick={() => showToast('Вы предложили обмен Ивану')}>Предложить обмен</button>
  },
}))

afterEach(() => {
  failures.route = false
  vi.restoreAllMocks()
})

describe('App', () => {
  it('предоставляет уведомления компонентам маршрутов', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByRole('button', { name: 'Предложить обмен' }))
    expect(screen.getByText('Вы предложили обмен Ивану')).toBeInTheDocument()
  })

  it('показывает 500 при падении маршрутов без внешнего роутера', () => {
    vi.spyOn(console, 'error').mockImplementation(() => {})
    failures.route = true
    render(<App />)
    expect(screen.getByRole('heading', { name: 'На сервере произошла ошибка' })).toBeInTheDocument()
    expect(screen.queryByRole('button', { name: 'Предложить обмен' })).not.toBeInTheDocument()
  })

  it.each([
    ['StoreProvider', () => vi.spyOn(storeProvider, 'StoreProvider')],
    ['ThemeProvider', () => vi.spyOn(themeProvider, 'ThemeProvider')],
    ['ToastProvider', () => vi.spyOn(toastProvider, 'ToastProvider')],
  ] as const)('показывает 500 при падении %s', (_name, spyOnProvider) => {
    vi.spyOn(console, 'error').mockImplementation(() => {})
    spyOnProvider().mockImplementation(() => {
      throw new Error('Ошибка провайдера')
    })
    render(<App />)
    expect(screen.getByRole('heading', { name: 'На сервере произошла ошибка' })).toBeInTheDocument()
  })
})
