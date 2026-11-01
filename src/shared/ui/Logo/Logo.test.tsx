import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { Logo } from './Logo'

it('links to the home page', () => {
  render(
    <MemoryRouter>
      <Logo />
    </MemoryRouter>,
  )

  expect(screen.getByRole('link', { name: 'SkillSwap' })).toHaveAttribute('href', '/')
})

it('has an accessible name without text', () => {
  render(
    <MemoryRouter>
      <Logo withText={false} />
    </MemoryRouter>,
  )

  expect(screen.getByRole('link', { name: 'SkillSwap — главная' })).toBeInTheDocument()
})
