import { screen } from '@testing-library/react'
import { renderWithProviders } from '@/app/test/renderWithProviders'
import { ActiveFilters } from './ActiveFilters'

describe('ActiveFilters', () => {
  it('передаёт id удаляемой плашки, даже если подписи совпадают', async () => {
    const onRemove = vi.fn()
    const { user } = renderWithProviders(
      <ActiveFilters
        items={[
          { id: 'city:m', label: 'Москва' },
          { id: 'skill:m', label: 'Москва' },
        ]}
        onRemove={onRemove}
      />,
    )
    await user.click(screen.getAllByRole('button', { name: 'Удалить Москва' })[1])
    expect(onRemove).toHaveBeenCalledTimes(1)
    expect(onRemove).toHaveBeenLastCalledWith('skill:m')
  })
  it('не показывает пустой список плашек', () => {
    renderWithProviders(<ActiveFilters items={[]} onRemove={vi.fn()} />)
    expect(screen.queryByRole('list', { name: 'Выбранные фильтры' })).not.toBeInTheDocument()
  })
})
