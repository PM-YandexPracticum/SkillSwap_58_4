import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import { EmptyState } from './EmptyState'

describe('EmptyState', () => {
  it('показывает заголовок и объявляет блок статусом для скринридера', () => {
    render(<EmptyState title="Ничего не найдено" />)

    expect(screen.getByRole('status')).toBeTruthy()
    expect(screen.getByRole('heading', { level: 3 }).textContent).toBe('Ничего не найдено')
  })

  it('выводит описание только когда оно передано', () => {
    const { rerender } = render(<EmptyState title="Ничего не найдено" />)
    expect(screen.queryByText('Попробуйте изменить фильтры')).toBeNull()

    rerender(<EmptyState title="Ничего не найдено" description="Попробуйте изменить фильтры" />)
    expect(screen.getByText('Попробуйте изменить фильтры')).toBeTruthy()
  })

  it('выводит иконку только когда она передана', () => {
    const { rerender } = render(<EmptyState title="Ничего не найдено" />)
    expect(screen.queryByTestId('empty-icon')).toBeNull()

    rerender(<EmptyState title="Ничего не найдено" icon={<svg data-testid="empty-icon" />} />)
    expect(screen.getByTestId('empty-icon')).toBeTruthy()
  })

  it('не рисует кнопку, если действие не передано', () => {
    render(<EmptyState title="Ничего не найдено" />)
    expect(screen.queryByRole('button')).toBeNull()
  })

  it('кнопка действия имеет type="button" и вызывает onClick', async () => {
    const user = userEvent.setup()
    const onClick = vi.fn()

    render(<EmptyState title="Ничего не найдено" action={{ label: 'Сбросить фильтры', onClick }} />)

    const button = screen.getByRole('button', { name: 'Сбросить фильтры' })
    expect(button.getAttribute('type')).toBe('button')

    await user.click(button)
    expect(onClick).toHaveBeenCalledTimes(1)
  })

  it('в компактном режиме добавляет класс на корневой блок', () => {
    render(<EmptyState title="Уведомлений пока нет" compact />)
    expect(screen.getByRole('status').className).toContain('compact')
  })
})
