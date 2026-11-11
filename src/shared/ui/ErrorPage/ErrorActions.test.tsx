import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

import { ErrorActions } from './ErrorActions'

describe('ErrorActions', () => {
  it('показывает обе кнопки и вызывает переход на главную', async () => {
    const user = userEvent.setup()
    const onHome = vi.fn()

    render(<ErrorActions onHome={onHome} />)

    expect(screen.getByRole('button', { name: 'Сообщить об ошибке' })).toBeInTheDocument()
    await user.click(screen.getByRole('button', { name: 'На главную' }))

    expect(onHome).toHaveBeenCalledTimes(1)
  })
})
