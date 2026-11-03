import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'

import { ROUTER_FUTURE } from '@/shared/config'

import { Logo } from './Logo'

describe('Logo', () => {
  it('ведёт на главную', () => {
    render(
      <MemoryRouter future={ROUTER_FUTURE}>
        <Logo />
      </MemoryRouter>,
    )

    expect(screen.getByRole('link', { name: 'SkillSwap' })).toHaveAttribute('href', '/')
  })

  it('без текста у ссылки есть подпись для скринридера', () => {
    render(
      <MemoryRouter future={ROUTER_FUTURE}>
        <Logo withText={false} />
      </MemoryRouter>,
    )

    expect(screen.getByRole('link', { name: 'SkillSwap — главная' })).toBeInTheDocument()
    expect(screen.queryByText('SkillSwap')).not.toBeInTheDocument()
  })
})
