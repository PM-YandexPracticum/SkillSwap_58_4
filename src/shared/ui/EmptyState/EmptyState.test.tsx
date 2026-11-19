import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import { EmptyState } from './EmptyState'

describe('EmptyState', () => {
  it('показывает сообщение и объявляет блок статусом для скринридера', () => {
    render(<EmptyState title="Ничего не найдено" />)

    expect(screen.getByRole('status')).toHaveTextContent('Ничего не найдено')
  })

  it('выводит описание только когда оно передано', () => {
    const { rerender } = render(<EmptyState title="Ничего не найдено" />)
    expect(screen.queryByText('Попробуйте изменить фильтры')).toBeNull()

    rerender(<EmptyState title="Ничего не найдено" description="Попробуйте изменить фильтры" />)
    expect(screen.getByText('Попробуйте изменить фильтры')).toBeTruthy()
  })

  it('выводит иконку только когда она передана', () => {
    const { rerender } = render(<EmptyState title="Ничего не найдено" />)
    expect(screen.queryByRole('img', { hidden: true })).not.toBeInTheDocument()

    rerender(
      <EmptyState
        title="Ничего не найдено"
        icon={<svg role="img" aria-label="Декоративная иконка" />}
      />,
    )
    expect(screen.getByRole('img', { hidden: true })).toBeInTheDocument()
    expect(screen.queryByRole('img')).not.toBeInTheDocument()
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

  it('позволяет выполнить действие с клавиатуры', async () => {
    const user = userEvent.setup()
    const onClick = vi.fn()
    render(<EmptyState title="Пока пусто" action={{ label: 'Вернуться в каталог', onClick }} />)

    await user.tab()
    expect(screen.getByRole('button', { name: 'Вернуться в каталог' })).toHaveFocus()
    await user.keyboard('{Enter}')
    expect(onClick).toHaveBeenCalledTimes(1)
  })

  it('в компактном режиме оставляет понятное сообщение без кнопок и заголовков', () => {
    render(<EmptyState title="Уведомлений пока нет" compact />)
    expect(screen.getByRole('status')).toHaveTextContent('Уведомлений пока нет')
    expect(screen.queryByRole('button')).not.toBeInTheDocument()
    expect(screen.queryByRole('heading')).not.toBeInTheDocument()
  })
})
