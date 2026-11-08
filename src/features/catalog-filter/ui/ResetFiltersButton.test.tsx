import { fireEvent, render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import { ResetFiltersButton } from './ResetFiltersButton'

describe('ResetFiltersButton', () => {
  it('вызывает onClick при клике', () => {
    const onClickMock = vi.fn()
    render(<ResetFiltersButton onClick={onClickMock} />)

    const button = screen.getByRole('button', { name: /сбросить/i })
    fireEvent.click(button)

    expect(onClickMock).toHaveBeenCalledTimes(1)
  })
})
