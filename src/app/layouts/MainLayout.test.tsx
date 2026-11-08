import { screen, within } from '@testing-library/react'
import { Route, Routes } from 'react-router-dom'

import { renderWithProviders } from '@/app/test/renderWithProviders'
import { selectSearchQuery } from '@/features/skill-search'
import { ROUTES } from '@/shared/config'
import { AuthLayout } from './AuthLayout'
import { MainLayout } from './MainLayout'

function renderLayout() {
  return renderWithProviders(
    <Routes>
      <Route element={<MainLayout />}>
        <Route
          path={ROUTES.HOME}
          element={
            <main>
              <h1>Каталог</h1>
            </main>
          }
        />
      </Route>
      <Route element={<AuthLayout />}>
        <Route
          path={ROUTES.LOGIN}
          element={
            <main>
              <h1>Вход</h1>
            </main>
          }
        />
      </Route>
    </Routes>,
  )
}

describe('MainLayout', () => {
  it('показывает шапку, страницу и подвал с единственной основной областью', () => {
    renderLayout()

    expect(screen.getByRole('banner')).toBeInTheDocument()
    expect(
      within(screen.getByRole('main')).getByRole('heading', { name: 'Каталог' }),
    ).toBeInTheDocument()
    expect(screen.getByRole('contentinfo')).toBeInTheDocument()
  })

  it('использует навигацию готовой шапки для перехода на вход', async () => {
    const { user } = renderLayout()

    await user.click(screen.getByRole('button', { name: 'Войти' }))

    expect(screen.getByRole('heading', { name: 'Вход' })).toBeInTheDocument()
    expect(screen.queryByRole('contentinfo')).not.toBeInTheDocument()
  })

  it('сохраняет применённый поиск после входа и возврата в основной лейаут', async () => {
    const { user, store } = renderLayout()
    await user.type(screen.getByRole('textbox', { name: 'Искать навык' }), '  Гитара  {Enter}')
    expect(selectSearchQuery(store.getState())).toBe('Гитара')

    await user.click(screen.getByRole('button', { name: 'Войти' }))
    expect(screen.queryByRole('search')).not.toBeInTheDocument()
    await user.click(screen.getByRole('button', { name: 'Закрыть' }))

    expect(screen.getByRole('textbox', { name: 'Искать навык' })).toHaveValue('Гитара')
    await user.click(screen.getByRole('button', { name: 'Очистить поиск' }))

    expect(selectSearchQuery(store.getState())).toBe('')
    expect(screen.getByRole('textbox', { name: 'Искать навык' })).toHaveValue('')
    expect(screen.getByRole('textbox', { name: 'Искать навык' })).toHaveFocus()
  })
})
