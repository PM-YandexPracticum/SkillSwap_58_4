import { screen, within } from '@testing-library/react'
import { Route, Routes } from 'react-router-dom'

import { renderWithProviders } from '@/app/test/renderWithProviders'
import { getSkills } from '@/entities/skill'
import { getSkillRoute, ROUTES } from '@/shared/config'

import { SkillPage } from './SkillPage'

// Карусели на Embla в jsdom не нужны: достаточно слайдов
vi.mock('@/shared/ui/Carousel', () => ({
  Carousel: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="carousel">{children}</div>
  ),
}))

// getSkills работает как обычно, пока тест не попросит ошибку: mockRejectedValueOnce
vi.mock('@/entities/skill', async (importOriginal) => {
  const actual = await importOriginal<typeof import('@/entities/skill')>()
  return { ...actual, getSkills: vi.fn(actual.getSkills) }
})

const LOAD_TIMEOUT = { timeout: 3000 }

function renderSkillPage(skillId: string) {
  return renderWithProviders(<SkillPage />, { path: ROUTES.SKILL, route: getSkillRoute(skillId) })
}

describe('SkillPage', () => {
  it('показывает навык, его автора и справочные названия из базы', async () => {
    renderSkillPage('s01')

    expect(
      await screen.findByRole('heading', { level: 1, name: 'Игра на барабанах' }, LOAD_TIMEOUT),
    ).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: 'Иван' })).toBeInTheDocument()
    expect(screen.getByText('Творчество и искусство / Музыка и звук')).toBeInTheDocument()
    expect(screen.getByText(/^Санкт-Петербург, /)).toBeInTheDocument()
  })

  it('внизу — «Похожие предложения»: другие авторы той же подкатегории, без самого автора', async () => {
    renderSkillPage('s01')

    const section = await screen.findByRole('region', { name: 'Похожие предложения' }, LOAD_TIMEOUT)

    expect(within(section).getByRole('heading', { name: 'Наталья' })).toBeInTheDocument()
    expect(within(section).queryByRole('heading', { name: 'Иван' })).not.toBeInTheDocument()
  })

  it('если похожих нет — блока «Похожие предложения» нет', async () => {
    renderSkillPage('s03')

    await screen.findByRole(
      'heading',
      { level: 1, name: 'Тайм-менеджмент для фрилансеров' },
      LOAD_TIMEOUT,
    )

    expect(screen.queryByRole('region', { name: 'Похожие предложения' })).not.toBeInTheDocument()
  })

  it('«Предложить обмен» открывает окно «Вы предложили обмен», после «Готово» кнопка — «Обмен предложен»', async () => {
    const { user } = renderSkillPage('s01')
    await user.click(await screen.findByRole('button', { name: 'Предложить обмен' }, LOAD_TIMEOUT))

    expect(screen.getByRole('dialog', { name: 'Вы предложили обмен' })).toBeInTheDocument()

    await user.click(screen.getByRole('button', { name: 'Готово' }))

    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Обмен предложен' })).toBeDisabled()
    expect(screen.queryByRole('button', { name: 'Предложить обмен' })).not.toBeInTheDocument()
  })

  it('не удалось загрузить данные — страница ошибки сервера', async () => {
    vi.mocked(getSkills).mockRejectedValueOnce(new Error('Не удалось загрузить данные «skills»'))

    renderWithProviders(
      <Routes>
        <Route path={ROUTES.SKILL} element={<SkillPage />} />
        <Route path={ROUTES.SERVER_ERROR} element={<h1>Ошибка сервера</h1>} />
      </Routes>,
      { route: getSkillRoute('s01') },
    )

    expect(
      await screen.findByRole('heading', { name: 'Ошибка сервера' }, LOAD_TIMEOUT),
    ).toBeInTheDocument()
  })
})
