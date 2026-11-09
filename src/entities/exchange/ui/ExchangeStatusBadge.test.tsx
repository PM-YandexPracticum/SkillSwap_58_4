import { render, screen } from '@testing-library/react'

import { ExchangeStatusBadge } from './ExchangeStatusBadge'

describe('ExchangeStatusBadge', () => {
  it('показывает статичный текст и скрывает декоративную иконку', () => {
    const { container } = render(<ExchangeStatusBadge />)

    expect(screen.getByText('Обмен предложен')).toBeInTheDocument()
    expect(screen.queryByRole('status')).not.toBeInTheDocument()
    expect(container.querySelector('svg')).toHaveAttribute('aria-hidden', 'true')
  })
})
