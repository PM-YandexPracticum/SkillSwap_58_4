import { screen, within } from '@testing-library/react'
import { Link, Route, Routes } from 'react-router-dom'

import { renderWithProviders } from '@/app/test/renderWithProviders'
import { draftUpdated } from '@/features/register'
import { ROUTES } from '@/shared/config'

import { AuthLayout } from './AuthLayout'

function renderLayout(route: string) {
  return renderWithProviders(
    <Routes>
      <Route path={ROUTES.HOME} element={<h1>Каталог</h1>} />
      <Route
        path={ROUTES.ABOUT}
        element={
          <main>
            <h1>О проекте</h1>
            <Link to={ROUTES.LOGIN}>Войти</Link>
          </main>
        }
      />
      <Route element={<AuthLayout />}>
        <Route
          path={ROUTES.LOGIN}
          element={
            <main>
              <h1>Вход</h1>
            </main>
          }
        />
        <Route
          path={ROUTES.REGISTER_STEP_1}
          element={
            <main>
              <h1>Регистрация</h1>
            </main>
          }
        />
      </Route>
    </Routes>,
    { route },
  )
}

describe('AuthLayout', () => {
  it.each([
    [ROUTES.LOGIN, 'Вход'],
    [ROUTES.REGISTER_STEP_1, 'Регистрация'],
  ])(
    'на %s показывает страницу, логотип и закрытие без основного меню и подвала',
    (route, title) => {
      renderLayout(route)

      expect(
        within(screen.getByRole('main')).getByRole('heading', { name: title }),
      ).toBeInTheDocument()
      expect(screen.getByRole('link', { name: 'SkillSwap' })).toBeInTheDocument()
      expect(screen.getByRole('button', { name: 'Закрыть' })).toBeInTheDocument()
      expect(
        screen.queryByRole('navigation', { name: 'Основная навигация' }),
      ).not.toBeInTheDocument()
      expect(screen.queryByRole('contentinfo')).not.toBeInTheDocument()
    },
  )

  it('закрытие возвращает именно на предыдущую страницу', async () => {
    const { user } = renderLayout(ROUTES.ABOUT)
    await user.click(screen.getByRole('link', { name: 'Войти' }))
    await user.click(screen.getByRole('button', { name: 'Закрыть' }))

    expect(screen.getByRole('heading', { name: 'О проекте' })).toBeInTheDocument()
    expect(screen.queryByRole('heading', { name: 'Вход' })).not.toBeInTheDocument()
  })

  it('позволяет закрыть страницу клавишей Enter', async () => {
    const { user } = renderLayout(ROUTES.ABOUT)
    await user.click(screen.getByRole('link', { name: 'Войти' }))
    await user.tab()
    await user.tab()
    expect(screen.getByRole('button', { name: 'Закрыть' })).toHaveFocus()

    await user.keyboard('{Enter}')

    expect(screen.getByRole('heading', { name: 'О проекте' })).toBeInTheDocument()
  })

  it('логотип ведёт на главную независимо от предыдущей страницы', async () => {
    const { user } = renderLayout(ROUTES.LOGIN)
    await user.click(screen.getByRole('link', { name: 'SkillSwap' }))

    expect(screen.getByRole('heading', { name: 'Каталог' })).toBeInTheDocument()
  })

  it('закрытие входа не меняет черновик регистрации', async () => {
    const { user, store } = renderLayout(ROUTES.ABOUT)
    await user.click(screen.getByRole('link', { name: 'Войти' }))
    store.dispatch(draftUpdated({ email: 'new@mail.ru' }))
    await user.click(screen.getByRole('button', { name: 'Закрыть' }))

    expect(screen.getByRole('heading', { name: 'О проекте' })).toBeInTheDocument()
    expect(store.getState().register.draft.email).toBe('new@mail.ru')
  })
})
