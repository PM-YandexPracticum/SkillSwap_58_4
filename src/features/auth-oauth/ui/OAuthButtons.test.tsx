import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

import { OAuthButtons } from './OAuthButtons'

describe('OAuthButtons', () => {
  it('показывает кнопки Google и Apple и разделитель «или»', () => {
    render(<OAuthButtons />)

    expect(screen.getByRole('button', { name: 'Продолжить с Google' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Продолжить с Apple' })).toBeInTheDocument()
    expect(screen.getByText('или')).toBeInTheDocument()
  })

  it('внутри формы кнопки её не отправляют', async () => {
    const user = userEvent.setup()
    const onSubmit = vi.fn((event: React.FormEvent) => event.preventDefault())
    render(
      <form onSubmit={onSubmit}>
        <OAuthButtons />
      </form>,
    )

    await user.click(screen.getByRole('button', { name: 'Продолжить с Google' }))
    await user.click(screen.getByRole('button', { name: 'Продолжить с Apple' }))

    expect(onSubmit).not.toHaveBeenCalled()
  })

  it('доступны с клавиатуры по порядку: Google, затем Apple', async () => {
    const user = userEvent.setup()
    render(<OAuthButtons />)

    await user.tab()
    expect(screen.getByRole('button', { name: 'Продолжить с Google' })).toHaveFocus()
    await user.tab()
    expect(screen.getByRole('button', { name: 'Продолжить с Apple' })).toHaveFocus()
  })
})
