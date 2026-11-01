import { fireEvent, render, screen } from '@testing-library/react'

import { Dropdown } from './Dropdown'

describe('Dropdown', () => {
  const trigger = <button type="button">Открыть</button>

  it('не рендерит содержимое, если isOpen = false', () => {
    render(
      <Dropdown trigger={trigger} isOpen={false} onClose={vi.fn()}>
        <p>Меню</p>
      </Dropdown>,
    )

    expect(screen.queryByText('Меню')).not.toBeInTheDocument()
  })

  it('рендерит содержимое, если isOpen = true', () => {
    render(
      <Dropdown trigger={trigger} isOpen={true} onClose={vi.fn()}>
        <p>Меню</p>
      </Dropdown>,
    )

    expect(screen.getByText('Меню')).toBeInTheDocument()
  })

  it('вызывает onClose по Esc', () => {
    const onClose = vi.fn()
    render(
      <Dropdown trigger={trigger} isOpen={true} onClose={onClose}>
        <p>Меню</p>
      </Dropdown>,
    )

    fireEvent.keyDown(document, { key: 'Escape' })

    expect(onClose).toHaveBeenCalledTimes(1)
  })

  it('не реагирует на Esc, когда закрыт', () => {
    const onClose = vi.fn()
    render(
      <Dropdown trigger={trigger} isOpen={false} onClose={onClose}>
        <p>Меню</p>
      </Dropdown>,
    )

    fireEvent.keyDown(document, { key: 'Escape' })

    expect(onClose).not.toHaveBeenCalled()
  })

  it('вызывает onClose по клику мимо', () => {
    const onClose = vi.fn()
    render(
      <>
        <Dropdown trigger={trigger} isOpen={true} onClose={onClose}>
          <p>Меню</p>
        </Dropdown>
        <div data-testid="outside">Снаружи</div>
      </>,
    )

    fireEvent.mouseDown(screen.getByTestId('outside'))

    expect(onClose).toHaveBeenCalledTimes(1)
  })

  it('не закрывает по клику внутри поповера', () => {
    const onClose = vi.fn()
    render(
      <Dropdown trigger={trigger} isOpen={true} onClose={onClose}>
        <p>Меню</p>
      </Dropdown>,
    )

    fireEvent.mouseDown(screen.getByText('Меню'))

    expect(onClose).not.toHaveBeenCalled()
  })

  it('рендерит содержимое с align="end"', () => {
    render(
      <Dropdown trigger={trigger} isOpen={true} onClose={vi.fn()} align="end">
        <p>Меню</p>
      </Dropdown>,
    )

    expect(screen.getByText('Меню')).toBeInTheDocument()
  })
})
