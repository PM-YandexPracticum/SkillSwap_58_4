import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Toast } from './Toast'

describe('Toast', () => {
  it('показывает переданное сообщение как текст', () => {
    render(<Toast message="Вы предложили обмен Ивану" onClose={vi.fn()} />)
    expect(screen.getByText('Вы предложили обмен Ивану')).toBeInTheDocument()
  })

  it('вызывает обработчик по нажатию доступной кнопки закрытия', async () => {
    const user = userEvent.setup()
    const onClose = vi.fn()
    render(<Toast message="Вы предложили обмен Ивану" onClose={onClose} />)

    await user.click(screen.getByRole('button', { name: 'Закрыть уведомление' }))

    expect(onClose).toHaveBeenCalledOnce()
  })
})
