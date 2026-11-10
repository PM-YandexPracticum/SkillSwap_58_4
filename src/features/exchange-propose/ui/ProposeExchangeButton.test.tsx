import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

import { ProposeExchangeButton } from './ProposeExchangeButton'

describe('ProposeExchangeButton', () => {
  it('по умолчанию — активная кнопка «Предложить обмен»', () => {
    render(<ProposeExchangeButton toUserId="u01" skillId="s01" />)

    expect(screen.getByRole('button', { name: 'Предложить обмен' })).toBeEnabled()
  })

  it('вызывает onClick по клику', async () => {
    const user = userEvent.setup()
    const onClick = vi.fn()
    render(<ProposeExchangeButton toUserId="u01" skillId="s01" onClick={onClick} />)

    await user.click(screen.getByRole('button', { name: 'Предложить обмен' }))

    expect(onClick).toHaveBeenCalledTimes(1)
  })

  it('когда обмен предложен — неактивная кнопка «Обмен предложен», «Предложить обмен» нет', () => {
    render(<ProposeExchangeButton toUserId="u01" skillId="s01" isProposed />)

    expect(screen.getByRole('button', { name: 'Обмен предложен' })).toBeDisabled()
    expect(screen.queryByRole('button', { name: 'Предложить обмен' })).not.toBeInTheDocument()
  })

  it('когда обмен предложен — клик onClick не вызывает', async () => {
    const user = userEvent.setup()
    const onClick = vi.fn()
    render(<ProposeExchangeButton toUserId="u01" skillId="s01" isProposed onClick={onClick} />)

    await user.click(screen.getByRole('button', { name: 'Обмен предложен' }))

    expect(onClick).not.toHaveBeenCalled()
  })
})
