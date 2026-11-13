import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

import { OfferCreatedModal } from './OfferCreatedModal'

describe('OfferCreatedModal', () => {
  it('открыто — диалог «Ваше предложение создано» с пояснением и кнопкой «Готово»', () => {
    render(<OfferCreatedModal isOpen onClose={() => {}} />)

    expect(screen.getByRole('dialog', { name: 'Ваше предложение создано' })).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: 'Ваше предложение создано' })).toBeInTheDocument()
    expect(screen.getByText('Теперь вы можете предложить обмен')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Готово' })).toBeInTheDocument()
  })

  it('закрыто — ничего не показывает', () => {
    render(<OfferCreatedModal isOpen={false} onClose={() => {}} />)

    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
  })

  it('«Готово» и Esc вызывают onClose', async () => {
    const user = userEvent.setup()
    const onClose = vi.fn()
    render(<OfferCreatedModal isOpen onClose={onClose} />)

    await user.click(screen.getByRole('button', { name: 'Готово' }))
    await user.keyboard('{Escape}')

    expect(onClose).toHaveBeenCalledTimes(2)
  })
})
