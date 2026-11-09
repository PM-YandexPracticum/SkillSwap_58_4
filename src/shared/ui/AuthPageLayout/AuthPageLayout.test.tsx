import { render, screen } from '@testing-library/react'
import { AuthPageLayout } from './AuthPageLayout'

describe('AuthPageLayout', () => {
  it('сохраняет название страницы при отображении прогресса', () => {
    render(
      <AuthPageLayout
        title="Регистрация"
        progress={<p>Шаг 1 из 3</p>}
        illustration={<h2>Иллюстрация</h2>}
      >
        <p>Форма</p>
      </AuthPageLayout>,
    )

    expect(screen.getAllByRole('main')).toHaveLength(1)
    expect(screen.getByRole('heading', { level: 1, name: 'Регистрация' })).toBeInTheDocument()
    expect(screen.getByText('Шаг 1 из 3')).toBeInTheDocument()
    expect(screen.getByText('Форма')).toBeInTheDocument()
    expect(screen.getByRole('heading', { level: 2, name: 'Иллюстрация' })).toBeInTheDocument()
  })
})
