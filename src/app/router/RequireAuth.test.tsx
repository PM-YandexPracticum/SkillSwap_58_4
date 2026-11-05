import type { ReactElement } from 'react'
import { screen } from '@testing-library/react'
import { Route, Routes, useLocation } from 'react-router-dom'

import { renderWithProviders } from '@/app/test/renderWithProviders'
import { ROUTES } from '@/shared/config'

import { RequireAuth } from './RequireAuth'

/**
 * Заглушка страницы входа для теста `RequireAuth`.
 * Показывает заголовок «Вход» и адрес, откуда пришёл гость (`state.from`).
 * В приложении не используется — настоящая страница входа в P4-09.
 */
const LoginProbe = (): ReactElement => {
  const location = useLocation()
  const from = (location.state as { from?: { pathname: string; search: string } } | null)?.from
  const fromPath = `${from?.pathname ?? ''}${from?.search ?? ''}`

  return (
    <>
      <h1>Вход</h1>
      <div>Откуда: {fromPath}</div>
    </>
  )
}

/**
 * Мини-приложение из двух маршрутов для теста `RequireAuth`:
 * закрытый `/profile` (обёрнут в `RequireAuth`) и `/login` (заглушка `LoginProbe`).
 */
const TestApp = (): ReactElement => {
  return (
    <Routes>
      <Route
        path={ROUTES.PROFILE}
        element={
          <RequireAuth>
            <div>Профиль</div>
          </RequireAuth>
        }
      />
      <Route path={ROUTES.LOGIN} element={<LoginProbe />} />
    </Routes>
  )
}

describe('RequireAuth', () => {
  it('гостя на /profile перенаправляет на /login и запоминает адрес', () => {
    renderWithProviders(<TestApp />, {
      preloadedState: { session: { session: null } },
      route: ROUTES.PROFILE,
    })

    expect(screen.getByRole('heading', { name: 'Вход' })).toBeInTheDocument()
    expect(screen.getByText('Откуда: /profile')).toBeInTheDocument()
    expect(screen.queryByText('Профиль')).not.toBeInTheDocument()
  })

  it('гость на /profile?tab=skills — запоминается и search', () => {
    const route = '/profile?tab=skills'
    renderWithProviders(<TestApp />, {
      preloadedState: { session: { session: null } },
      route: route,
    })

    expect(screen.getByText(`Откуда: ${route}`)).toBeInTheDocument()
  })

  it('вошедший на /profile — видит содержимое', () => {
    renderWithProviders(<TestApp />, {
      preloadedState: { session: { session: { userId: 'u01', token: 'test' } } },
      route: ROUTES.PROFILE,
    })

    expect(screen.getByText('Профиль')).toBeInTheDocument()
    expect(screen.queryByRole('heading', { name: 'Вход' })).not.toBeInTheDocument()
  })
})
