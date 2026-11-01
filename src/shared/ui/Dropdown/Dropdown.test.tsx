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

  describe('сдвиг внутрь окна', () => {
    // Окно 1000px, поповер 260px. Без сдвига его правый край на 1160px — вылезает за окно.
    const NATURAL_RIGHT = 1160

    beforeEach(() => {
      vi.spyOn(document.documentElement, 'clientWidth', 'get').mockReturnValue(1000)
      vi.spyOn(HTMLElement.prototype, 'getBoundingClientRect').mockImplementation(function (
        this: HTMLElement,
      ) {
        const right = NATURAL_RIGHT + (parseFloat(this.style.translate) || 0)
        return { left: right - 260, right } as DOMRect
      })
    })

    afterEach(() => {
      vi.restoreAllMocks()
    })

    function renderMenu(text: string) {
      return (
        <Dropdown trigger={trigger} isOpen={true} onClose={vi.fn()}>
          <p>{text}</p>
        </Dropdown>
      )
    }

    it('оставляет до правого края окна 36px', () => {
      render(renderMenu('Меню'))

      // 1000 - 36 = 964, нужно сдвинуть на 1160 - 964 = 196px влево
      expect(screen.getByText('Меню').parentElement).toHaveStyle({ translate: '-196px 0' })
    })

    it('не прыгает, когда родитель перерисовывается', () => {
      const { rerender } = render(renderMenu('Меню'))

      rerender(renderMenu('Меню 2'))
      rerender(renderMenu('Меню 3'))

      expect(screen.getByText('Меню 3').parentElement).toHaveStyle({ translate: '-196px 0' })
    })
  })
})
