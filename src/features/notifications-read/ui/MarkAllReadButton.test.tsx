import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

import { MarkAllReadButton } from './MarkAllReadButton'

describe('MarkAllReadButton', () => {
  it('показывает текст «Прочитать все»', () => {
    render(<MarkAllReadButton />)

    expect(screen.getByRole('button', { name: 'Прочитать все' })).toBeInTheDocument()
  })

  it('вызывает onClick по клику', async () => {
    const user = userEvent.setup()
    const onClick = vi.fn()

    render(<MarkAllReadButton onClick={onClick} />)
    await user.click(screen.getByRole('button', { name: 'Прочитать все' }))

    expect(onClick).toHaveBeenCalledTimes(1)
  })
})
