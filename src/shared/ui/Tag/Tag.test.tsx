import { render, screen, fireEvent } from '@testing-library/react'
import { Tag, isTagColor } from './Tag'
import { vi, describe, it, expect } from 'vitest'

describe('Tag', () => {
  it('без onRemove рендерит чип без крестика', () => {
    render(<Tag label="Игра на барабанах" color="creativity" />)

    expect(screen.getByText('Игра на барабанах')).toBeInTheDocument()
    expect(screen.queryByRole('button')).not.toBeInTheDocument()
  })

  it('с onRemove рендерит крестик и вызывает колбэк по клику', () => {
    const onRemove = vi.fn()
    render(<Tag label="Москва" color="home" onRemove={onRemove} />)

    const removeButton = screen.getByRole('button', { name: /удалить москва/i })
    fireEvent.click(removeButton)

    expect(onRemove).toHaveBeenCalledTimes(1)
  })

  it('применяет цвет, переданный снаружи', () => {
    render(<Tag label="+2" color="more" />)
    const tag = screen.getByText('+2').parentElement!

    expect(tag.style.backgroundColor).not.toBe('')
  })
})

describe('isTagColor', () => {
  it.each(['business', 'creativity', 'languages', 'education', 'health', 'home', 'more'])(
    '%s — цвет чипа',
    (id) => {
      expect(isTagColor(id)).toBe(true)
    },
  )

  it.each(['unknown', '', 'toString', 'constructor', '__proto__'])(
    '«%s» — не цвет чипа, даже если это встроенное свойство объекта',
    (id) => {
      expect(isTagColor(id)).toBe(false)
    },
  )
})

describe('Tag: подсказка с полным названием', () => {
  /** jsdom не считает размеры — задаём ширину текста и места вручную */
  function mockWidths(scrollWidth: number, clientWidth: number) {
    vi.spyOn(HTMLElement.prototype, 'scrollWidth', 'get').mockReturnValue(scrollWidth)
    vi.spyOn(HTMLElement.prototype, 'clientWidth', 'get').mockReturnValue(clientWidth)
  }

  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('название обрезано — при наведении показывает его целиком', () => {
    mockWidths(200, 100)
    render(<Tag label="Быстрая уборка и организация пространства" color="home" />)
    const label = screen.getByText('Быстрая уборка и организация пространства')

    fireEvent.mouseEnter(label)

    expect(label).toHaveAttribute('title', 'Быстрая уборка и организация пространства')
  })

  it('название помещается — подсказки нет', () => {
    mockWidths(100, 100)
    render(<Tag label="Йога" color="health" />)
    const label = screen.getByText('Йога')

    fireEvent.mouseEnter(label)

    expect(label).not.toHaveAttribute('title')
  })
})
