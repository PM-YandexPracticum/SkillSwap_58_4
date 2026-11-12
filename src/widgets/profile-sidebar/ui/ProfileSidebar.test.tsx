import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { describe, it, expect } from 'vitest'
import { ProfileSidebar } from './ProfileSidebar'

describe('ProfileSidebar', () => {
  it('отрисовывает все пункты меню', () => {
    render(
      <MemoryRouter>
        <ProfileSidebar />
      </MemoryRouter>,
    )

    expect(screen.getByText('Заявки')).toBeInTheDocument()
    expect(screen.getByText('Мои обмены')).toBeInTheDocument()
    expect(screen.getByText('Избранное')).toBeInTheDocument()
    expect(screen.getByText('Мои навыки')).toBeInTheDocument()
    expect(screen.getByText('Личные данные')).toBeInTheDocument()
  })

  it('подсвечивает активный пункт', () => {
    render(
      <MemoryRouter initialEntries={['/profile']}>
        <ProfileSidebar />
      </MemoryRouter>,
    )

    const activeLink = screen.getByText('Личные данные').closest('a')
    expect(activeLink?.className).toContain('active')
  })
})
