import { IconButton } from './IconButton'
import { render, screen, fireEvent } from '@testing-library/react'
import NotificationIcon from '../../assets/icons/notification.svg?react'

describe('IconButton', () => {
  test('вызывает onClick при нажатии', () => {
    const handleClick = vi.fn()

    render(<IconButton ariaLabel="Уведомления" icon={<NotificationIcon />} onClick={handleClick} />)

    fireEvent.click(screen.getByLabelText('Уведомления'))

    expect(handleClick).toHaveBeenCalled()
  })

  test('находится по aria-label', () => {
    render(<IconButton ariaLabel="Уведомления" icon={<NotificationIcon />} />)

    expect(screen.getByLabelText('Уведомления')).toBeInTheDocument()
  })
})
