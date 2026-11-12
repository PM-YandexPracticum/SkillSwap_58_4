import { render, screen } from '@testing-library/react'
import { describe, it, expect, vi, beforeAll, afterAll } from 'vitest'
import { MemoryRouter } from 'react-router-dom'
import { ErrorBoundary } from './ErrorBoundary'

const Bomb = () => {
  throw new Error('Test error')
}

describe('ErrorBoundary', () => {
  beforeAll(() => {
    vi.spyOn(console, 'error').mockImplementation(() => {})
  })

  afterAll(() => {
    vi.restoreAllMocks()
  })

  it('рендерит дочерние компоненты, если ошибки нет', () => {
    render(
      <MemoryRouter>
        <ErrorBoundary>
          <div>Всё хорошо</div>
        </ErrorBoundary>
      </MemoryRouter>,
    )
    expect(screen.getByText('Всё хорошо')).toBeInTheDocument()
  })

 it('показывает страницу 500, если дочерний компонент упал', async () => {
  render(
    <MemoryRouter>
      <ErrorBoundary>
        <Bomb />
      </ErrorBoundary>
    </MemoryRouter>
  );

  const heading = await screen.findByRole('heading', { name: /На сервере произошла ошибка/i });
  expect(heading).toBeInTheDocument();
});
})
