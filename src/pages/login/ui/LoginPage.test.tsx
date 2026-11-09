import { screen } from '@testing-library/react'
import { Route, Routes } from 'react-router-dom'

import { renderWithProviders } from '@/app/test/renderWithProviders'
import { ROUTES } from '@/shared/config'
import { LoginPage } from './LoginPage'

describe('LoginPage', () => {
  it('собирает форму входа, OAuth и иллюстрацию в одну основную область', () => {
    renderWithProviders(<LoginPage />)

    expect(screen.getAllByRole('main')).toHaveLength(1)
    expect(screen.getByRole('heading', { level: 1, name: 'Вход' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Продолжить с Google' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Продолжить с Apple' })).toBeInTheDocument()
    expect(screen.getByRole('form', { name: 'Вход' })).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: 'С возвращением в SkillSwap!' })).toBeInTheDocument()
  })

  it('ссылка регистрации открывает маршрут регистрации', async () => {
    const { user } = renderWithProviders(
      <Routes>
        <Route path={ROUTES.LOGIN} element={<LoginPage />} />
        <Route path={ROUTES.REGISTER} element={<h1>Первый шаг регистрации</h1>} />
      </Routes>,
      { route: ROUTES.LOGIN },
    )

    await user.click(screen.getByRole('link', { name: 'Зарегистрироваться' }))
    expect(screen.getByRole('heading', { name: 'Первый шаг регистрации' })).toBeInTheDocument()
  })

  it('вёрстка входа не создаёт сессию при отправке', async () => {
    const { user, store } = renderWithProviders(<LoginPage />)
    const session = store.getState().session
    await user.type(screen.getByLabelText('Email'), 'user@example.com')
    await user.type(screen.getByLabelText('Пароль'), 'password123')
    await user.click(screen.getByRole('button', { name: 'Войти' }))

    expect(screen.getByRole('heading', { level: 1, name: 'Вход' })).toBeInTheDocument()
    expect(store.getState().session).toEqual(session)
  })
})
