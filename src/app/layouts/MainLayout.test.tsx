import { screen, within } from '@testing-library/react'
import { Route, Routes } from 'react-router-dom'

import { renderWithProviders } from '@/app/test/renderWithProviders'
import { ROUTES } from '@/shared/config'
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
      <Route path={ROUTES.LOGIN} element={<h1>Вход</h1>} />
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
})
