import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { ROUTES } from '@/shared/config'

import { Footer } from './Footer'

const renderFooter = () =>
  render(
    <MemoryRouter>
      <Footer />
    </MemoryRouter>,
  )

describe('Footer', () => {
  it.each([
    { name: 'О проекте', href: ROUTES.ABOUT },
    { name: 'Все навыки', href: ROUTES.ALL_SKILLS },
  ])('«$name» ведёт на $href', ({ name, href }) => {
    renderFooter()

    expect(screen.getByRole('link', { name })).toHaveAttribute('href', href)
  })

  it.each(['Контакты', 'Блог', 'Политика конфиденциальности', 'Пользовательское соглашение'])(
    '«%s» — заглушка: виден, но не ссылка',
    (name) => {
      renderFooter()

      expect(screen.getByText(name)).toBeInTheDocument()
      expect(screen.queryByRole('link', { name })).not.toBeInTheDocument()
    },
  )

  it('показывает «SkillSwap — 2025»', () => {
    renderFooter()

    expect(screen.getByText('SkillSwap — 2025')).toBeInTheDocument()
  })
})
