import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

import { ExchangeProposedModal } from './ExchangeProposedModal'

describe('ExchangeProposedModal', () => {
  it('открыто — диалог «Вы предложили обмен» с пояснением и кнопкой «Готово»', () => {
    render(<ExchangeProposedModal isOpen onClose={() => {}} />)

    const dialog = screen.getByRole('dialog', { name: 'Вы предложили обмен' })
    expect(dialog).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: 'Вы предложили обмен' })).toBeInTheDocument()
    expect(
      screen.getByText('Теперь дождитесь подтверждения. Вам придёт уведомление'),
    ).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Готово' })).toBeInTheDocument()
  })

  it('закрыто — ничего не показывает', () => {
    render(<ExchangeProposedModal isOpen={false} onClose={() => {}} />)

    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
  })

  it('«Готово» вызывает onClose', async () => {
    const user = userEvent.setup()
    const onClose = vi.fn()
    render(<ExchangeProposedModal isOpen onClose={onClose} />)

    await user.click(screen.getByRole('button', { name: 'Готово' }))

    expect(onClose).toHaveBeenCalledTimes(1)
  })

  it('Esc вызывает onClose', async () => {
    const user = userEvent.setup()
    const onClose = vi.fn()
    render(<ExchangeProposedModal isOpen onClose={onClose} />)

    await user.keyboard('{Escape}')

    expect(onClose).toHaveBeenCalledTimes(1)
  })

  it('фокус сразу внутри окна — «Готово» доступна с клавиатуры', async () => {
    const user = userEvent.setup()
    const onClose = vi.fn()
    render(<ExchangeProposedModal isOpen onClose={onClose} />)

    await user.tab()
    expect(screen.getByRole('button', { name: 'Готово' })).toHaveFocus()
    await user.keyboard('{Enter}')

    expect(onClose).toHaveBeenCalledTimes(1)
  })
})
