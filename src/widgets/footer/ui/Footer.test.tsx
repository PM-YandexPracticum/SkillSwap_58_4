import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
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

  it('не добавляет заглушки в порядок перехода по Tab', async () => {
    const user = userEvent.setup()
    render(
      <MemoryRouter>
        <Footer />
        <button>Далее</button>
      </MemoryRouter>,
    )

    await user.tab()
    expect(screen.getByRole('link', { name: 'SkillSwap' })).toHaveFocus()

    await user.tab()
    expect(screen.getByRole('link', { name: 'О проекте' })).toHaveFocus()

    await user.tab()
    expect(screen.getByRole('link', { name: 'Все навыки' })).toHaveFocus()

    await user.tab()
    expect(screen.getByRole('button', { name: 'Далее' })).toHaveFocus()
  })
})
