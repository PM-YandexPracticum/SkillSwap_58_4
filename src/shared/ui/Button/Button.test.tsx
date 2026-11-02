import { Button } from './Button'
import { render, screen, fireEvent } from '@testing-library/react'

describe('Button', () => {
  test('вызывает onClick при нажатии', () => {
    const handleClick = vi.fn()

    render(<Button onClick={handleClick}>Подробнее</Button>)

    fireEvent.click(screen.getByText('Подробнее'))

    expect(handleClick).toHaveBeenCalled()
  })

  test('не вызывает onClick, если есть disabled', () => {
    const handleClick = vi.fn()

    render(
      <Button onClick={handleClick} disabled>
        Подробнее
      </Button>,
    )

    fireEvent.click(screen.getByText('Подробнее'))

    expect(handleClick).not.toHaveBeenCalled()
  })

  test('по умолчанию имеет type="button"', () => {
    render(<Button>Подробнее</Button>)

    expect(screen.getByText('Подробнее')).toHaveAttribute('type', 'button')
  })
})
