import { screen } from '@testing-library/react'
import { renderWithProviders } from '@/app/test/renderWithProviders'
import { SortToggle } from './SortToggle'

describe('SortToggle', () => {
  it.each([
    ['newest', 'Сначала новые', 'oldest'],
    ['oldest', 'Сначала старые', 'newest'],
  ] as const)('запрашивает смену %s с клавиатуры', async (value, label, next) => {
    const onChange = vi.fn()
    const { user } = renderWithProviders(<SortToggle value={value} onChange={onChange} />)
    const button = screen.getByRole('button', { name: label })
    button.focus()
    await user.keyboard('{Enter}')
    expect(onChange).toHaveBeenCalledTimes(1)
    expect(onChange).toHaveBeenLastCalledWith(next)
    expect(button).toHaveTextContent(label)
  })
})
