import { screen, within } from '@testing-library/react'
import { Route, Routes } from 'react-router-dom'

import { renderWithProviders } from '@/app/test/renderWithProviders'
import { selectSearchQuery } from '@/features/skill-search'
import { ROUTES } from '@/shared/config'
import { AllSkillsPage } from '@/pages/all-skills'
import categories from '../../../public/db/categories.json'
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
        <Route path={ROUTES.ALL_SKILLS} element={<AllSkillsPage />} />
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
    { preloadedState: { categories: { items: categories, status: 'succeeded' } } },
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

describe('MainLayout — Все навыки', () => {
  it('открывает один список готовым Dropdown и закрывает по Esc и клику мимо', async () => {
    const { user } = renderLayout()
    const trigger = screen.getByRole('button', { name: 'Все навыки' })

    await user.click(trigger)
    expect(trigger).toHaveAttribute('aria-expanded', 'true')
    expect(screen.getAllByRole('heading', { level: 2 })).toHaveLength(6)
    await user.click(screen.getByText('Управление командой'))
    expect(trigger).toHaveAttribute('aria-expanded', 'true')
    await user.keyboard('{Escape}')
    expect(screen.queryByRole('heading', { level: 2 })).not.toBeInTheDocument()

    await user.click(trigger)
    await user.click(screen.getByRole('heading', { name: 'Каталог' }))
    expect(trigger).toHaveAttribute('aria-expanded', 'false')
  })

  it('открывает список с клавиатуры и не добавляет статичные пункты в Tab-порядок', async () => {
    const { user } = renderLayout()
    const trigger = screen.getByRole('button', { name: 'Все навыки' })
    trigger.focus()
    await user.keyboard('{Enter}')
    expect(screen.getByRole('heading', { name: 'Бизнес и карьера' })).toBeInTheDocument()
    await user.tab()
    expect(screen.getByRole('region', { name: 'Все навыки' })).toHaveFocus()
    await user.tab()
    expect(screen.getByRole('button', { name: 'Искать' })).toHaveFocus()
    await user.tab({ shift: true })
    await user.keyboard('{Escape}')
    expect(trigger).toHaveFocus()
    expect(trigger).toHaveAttribute('aria-expanded', 'false')
  })

  it('ссылка из подвала ведёт на страницу с теми же шестью категориями', async () => {
    const { user } = renderLayout()
    await user.click(screen.getByRole('link', { name: 'Все навыки' }))

    expect(screen.getByRole('main', { name: 'Все навыки' })).toBeInTheDocument()
    expect(screen.getAllByRole('heading', { level: 2 })).toHaveLength(6)
    expect(screen.getByRole('banner')).toBeInTheDocument()
    expect(screen.getByRole('contentinfo')).toBeInTheDocument()
  })
})
