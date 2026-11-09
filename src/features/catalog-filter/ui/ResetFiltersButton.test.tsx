import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import { ResetFiltersButton } from './ResetFiltersButton'

describe('ResetFiltersButton', () => {
  it('передаёт нажатие с клавиатуры и не отправляет форму', async () => {
    const user = userEvent.setup()
    const onClick = vi.fn()
    const onSubmit = vi.fn((event) => event.preventDefault())
    render(
      <form onSubmit={onSubmit}>
        <ResetFiltersButton onClick={onClick} />
      </form>,
    )
    await user.tab()
    expect(screen.getByRole('button', { name: 'Сбросить' })).toHaveFocus()
    await user.keyboard('{Enter}')
    expect(onClick).toHaveBeenCalledTimes(1)
    expect(onSubmit).not.toHaveBeenCalled()
  })

  it('может оставаться номинальной кнопкой до P5-02', async () => {
    const user = userEvent.setup()
    render(<ResetFiltersButton />)
    await user.click(screen.getByRole('button', { name: 'Сбросить' }))
    expect(screen.getByRole('button', { name: 'Сбросить' })).toBeEnabled()
  })
})
