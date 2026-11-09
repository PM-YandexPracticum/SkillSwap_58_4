import { screen } from '@testing-library/react'

import { renderWithProviders } from '@/app/test/renderWithProviders'
import categories from '../../../../public/db/categories.json'
import { AllSkillsPage } from './AllSkillsPage'

describe('AllSkillsPage', () => {
  it('показывает основную область с заголовком страницы и общим списком категорий', () => {
    renderWithProviders(<AllSkillsPage />, {
      preloadedState: { categories: { items: categories, status: 'succeeded' } },
    })

    expect(screen.getByRole('main', { name: 'Все навыки' })).toBeInTheDocument()
    expect(screen.getByRole('heading', { level: 1, name: 'Все навыки' })).toBeInTheDocument()
    expect(screen.getAllByRole('heading', { level: 2 })).toHaveLength(6)
    expect(screen.queryByText('Страница в разработке')).not.toBeInTheDocument()
    expect(screen.queryByRole('banner')).not.toBeInTheDocument()
    expect(screen.queryByRole('contentinfo')).not.toBeInTheDocument()
  })
})
