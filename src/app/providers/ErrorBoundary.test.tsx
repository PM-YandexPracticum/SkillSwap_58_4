import { StrictMode } from 'react'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { ErrorBoundary } from './ErrorBoundary'

function BrokenPage(): never {
  throw new Error('Технические подробности ошибки')
}

beforeEach(() => {
  vi.spyOn(console, 'error').mockImplementation(() => {})
})

afterEach(() => {
  vi.restoreAllMocks()
  vi.unstubAllEnvs()
  vi.unstubAllGlobals()
})

describe('ErrorBoundary', () => {
  it('показывает содержимое, если ошибки нет', () => {
    render(
      <ErrorBoundary>
        <h1>Рабочая страница</h1>
      </ErrorBoundary>,
    )
    expect(screen.getByRole('heading', { name: 'Рабочая страница' })).toBeInTheDocument()
  })

  it('показывает понятную страницу 500 без роутера и store, в том числе в StrictMode', () => {
    render(
      <StrictMode>
        <ErrorBoundary>
          <BrokenPage />
        </ErrorBoundary>
      </StrictMode>,
    )
    expect(screen.getByRole('heading', { name: 'На сервере произошла ошибка' })).toBeInTheDocument()
    expect(
      screen.getByRole('img', { name: 'Монитор с надписью 500 SERVER ERROR' }),
    ).toBeInTheDocument()
    expect(screen.queryByText('Технические подробности ошибки')).not.toBeInTheDocument()
  })

  it.each(['/', '/skillswap/'])(
    'перезапускает приложение с главной с базовым путём %s',
    async (base) => {
      vi.stubEnv('BASE_URL', base)
      const assign = vi.fn()
      vi.stubGlobal('location', { assign })
      const user = userEvent.setup()
      render(
        <ErrorBoundary>
          <BrokenPage />
        </ErrorBoundary>,
      )
      await user.click(screen.getByRole('button', { name: 'На главную' }))
      expect(assign).toHaveBeenCalledTimes(1)
      expect(assign).toHaveBeenCalledWith(base)
    },
  )

  it('оставляет сообщение об ошибке заглушкой', async () => {
    const assign = vi.fn()
    vi.stubGlobal('location', { assign })
    const user = userEvent.setup()
    render(
      <ErrorBoundary>
        <BrokenPage />
      </ErrorBoundary>,
    )
    await user.click(screen.getByRole('button', { name: 'Сообщить об ошибке' }))
    expect(assign).not.toHaveBeenCalled()
    expect(screen.getByRole('heading', { name: 'На сервере произошла ошибка' })).toBeInTheDocument()
  })
})
