import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'

import { Logo } from './Logo'

describe('Logo', () => {
  it('ведёт на главную', () => {
    render(
      <MemoryRouter>
        <Logo />
      </MemoryRouter>,
    )

    expect(screen.getByRole('link', { name: 'SkillSwap' })).toHaveAttribute('href', '/')
  })

  it('без текста у ссылки есть подпись для скринридера', () => {
    render(
      <MemoryRouter>
        <Logo withText={false} />
      </MemoryRouter>,
    )

    expect(screen.getByRole('link', { name: 'SkillSwap — главная' })).toBeInTheDocument()
    expect(screen.queryByText('SkillSwap')).not.toBeInTheDocument()
  })
})
