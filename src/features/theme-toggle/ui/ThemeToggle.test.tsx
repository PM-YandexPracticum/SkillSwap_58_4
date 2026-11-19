import { screen } from '@testing-library/react'

import { renderWithProviders } from '@/app/test/renderWithProviders'
import { ThemeToggle } from './ThemeToggle'

afterEach(() => {
  localStorage.clear()
  document.documentElement.removeAttribute('data-theme')
  document.documentElement.style.removeProperty('color-scheme')
})

describe('ThemeToggle', () => {
  it('переключает тему доступной кнопкой', async () => {
    const { user } = renderWithProviders(<ThemeToggle />)
    const toggle = screen.getByRole('button', { name: 'Включить тёмную тему' })

    await user.click(toggle)

    expect(screen.getByRole('button', { name: 'Включить светлую тему' })).toHaveAttribute(
      'aria-pressed',
      'true',
    )
    expect(document.documentElement.dataset.theme).toBe('dark')
  })
})
