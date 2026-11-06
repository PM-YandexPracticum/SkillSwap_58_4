import type { ReactElement } from 'react'
import { act, screen } from '@testing-library/react'
import { Link, Route, Routes, useLocation, useNavigate } from 'react-router-dom'
import type { Location } from 'react-router-dom'

import { createTestStore } from '@/app/test/createTestStore'
import { renderWithProviders } from '@/app/test/renderWithProviders'
import { endSession, startSession } from '@/entities/session'
import { PROFILE_ROUTES, ROUTES } from '@/shared/config'

import { RequireAuth } from './RequireAuth'

/** Страница входа для проверки адреса возврата и истории; настоящая форма — P4-09. */
const LoginProbe = (): ReactElement => {
  const location = useLocation()
  const navigate = useNavigate()
  const from = (location.state as { from?: Location } | null)?.from
  const fromPath = `${from?.pathname ?? ''}${from?.search ?? ''}${from?.hash ?? ''}`

  return (
    <>
      <h1>Вход</h1>
      <div>Откуда: {fromPath}</div>
      <button onClick={() => navigate(-1)}>Назад</button>
    </>
  )
}

/** Закрытые профиль и избранное, публичная главная и заглушка входа. */
const TestApp = (): ReactElement => (
  <Routes>
    <Route
      path={ROUTES.HOME}
      element={
        <>
          <h1>Главная</h1>
          <Link to={ROUTES.FAVORITES}>Избранное</Link>
        </>
      }
    />
    <Route
      path={`${ROUTES.PROFILE}/*`}
      element={
        <RequireAuth>
          <h1>Профиль</h1>
        </RequireAuth>
      }
    />
    <Route
      path={ROUTES.FAVORITES}
      element={
        <RequireAuth>
          <h1>Избранное</h1>
        </RequireAuth>
      }
    />
    <Route path={ROUTES.LOGIN} element={<LoginProbe />} />
  </Routes>
)

const protectedRoutes = [
  [ROUTES.PROFILE, 'Профиль'],
  [ROUTES.FAVORITES, 'Избранное'],
  [`${ROUTES.PROFILE}/${PROFILE_ROUTES.PERSONAL}`, 'Профиль'],
] as const

describe('RequireAuth', () => {
  it.each(protectedRoutes)('гостя на %s отправляет на вход и запоминает адрес', (route, title) => {
    renderWithProviders(<TestApp />, {
      preloadedState: { session: { session: null } },
      route,
    })

    expect(screen.getByRole('heading', { name: 'Вход' })).toBeInTheDocument()
    expect(screen.getByText(`Откуда: ${route}`)).toBeInTheDocument()
    expect(screen.queryByRole('heading', { name: title })).not.toBeInTheDocument()
  })

  it('сохраняет query-параметры и hash адреса возврата', () => {
    const route = `${ROUTES.FAVORITES}?tab=liked#saved`
    renderWithProviders(<TestApp />, {
      preloadedState: { session: { session: null } },
      route,
    })

    expect(screen.getByText(`Откуда: ${route}`)).toBeInTheDocument()
  })

  it.each(protectedRoutes)('вошедшему на %s показывает содержимое', (route, title) => {
    renderWithProviders(<TestApp />, {
      preloadedState: { session: { session: { userId: 'u01', token: 'test' } } },
      route,
    })

    expect(screen.getByRole('heading', { name: title })).toBeInTheDocument()
    expect(screen.queryByRole('heading', { name: 'Вход' })).not.toBeInTheDocument()
  })

  it('после выхода скрывает закрытую страницу и отправляет на вход', () => {
    const route = `${ROUTES.PROFILE}/${PROFILE_ROUTES.PERSONAL}`
    const { store } = renderWithProviders(<TestApp />, {
      preloadedState: { session: { session: { userId: 'u01', token: 'test' } } },
      route,
    })
    expect(screen.getByRole('heading', { name: 'Профиль' })).toBeInTheDocument()

    act(() => {
      store.dispatch(endSession())
    })

    expect(screen.getByRole('heading', { name: 'Вход' })).toBeInTheDocument()
    expect(screen.getByText(`Откуда: ${route}`)).toBeInTheDocument()
    expect(screen.queryByRole('heading', { name: 'Профиль' })).not.toBeInTheDocument()
  })

  it('пропускает пользователя с сохранённой сессией после создания нового store', () => {
    createTestStore().dispatch(startSession('u01'))

    renderWithProviders(<TestApp />, { route: ROUTES.FAVORITES })

    expect(screen.getByRole('heading', { name: 'Избранное' })).toBeInTheDocument()
    expect(screen.queryByRole('heading', { name: 'Вход' })).not.toBeInTheDocument()
  })

  it('после редиректа кнопка «Назад» возвращает на публичную страницу', async () => {
    const { user } = renderWithProviders(<TestApp />, {
      preloadedState: { session: { session: null } },
      route: ROUTES.HOME,
    })
    await user.click(screen.getByRole('link', { name: 'Избранное' }))
    expect(screen.getByRole('heading', { name: 'Вход' })).toBeInTheDocument()

    await user.click(screen.getByRole('button', { name: 'Назад' }))

    expect(screen.getByRole('heading', { name: 'Главная' })).toBeInTheDocument()
    expect(screen.queryByRole('heading', { name: 'Вход' })).not.toBeInTheDocument()
  })
})
