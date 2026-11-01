import { renderHook } from '@testing-library/react'
import { fireEvent } from '@testing-library/react'
import { useRef } from 'react'

import { useClickOutside } from './useClickOutside'

describe('useClickOutside', () => {
  function setup() {
    const outside = document.createElement('div')
    const inside = document.createElement('div')
    document.body.append(outside, inside)

    const handler = vi.fn()
    const { result } = renderHook(() => {
      const ref = useRef<HTMLDivElement>(null)
      // привязываем ref к реальному узлу
      ;(ref as { current: HTMLDivElement | null }).current = inside
      useClickOutside(ref, handler)
      return ref
    })

    return { outside, inside, handler, result }
  }

  afterEach(() => {
    document.body.innerHTML = ''
  })

  it('вызывает handler при клике вне элемента', () => {
    const { outside, handler } = setup()

    fireEvent.mouseDown(outside)

    expect(handler).toHaveBeenCalledTimes(1)
  })

  it('не вызывает handler при клике внутри элемента', () => {
    const { inside, handler } = setup()

    fireEvent.mouseDown(inside)

    expect(handler).not.toHaveBeenCalled()
  })

  it('вызывает handler на touchstart вне элемента', () => {
    const { outside, handler } = setup()

    fireEvent.touchStart(outside)

    expect(handler).toHaveBeenCalledTimes(1)
  })

  it('не подписывается, если enabled = false', () => {
    const outside = document.createElement('div')
    document.body.append(outside)

    const handler = vi.fn()
    renderHook(() => {
      const ref = useRef<HTMLDivElement>(null)
      useClickOutside(ref, handler, false)
    })

    fireEvent.mouseDown(outside)

    expect(handler).not.toHaveBeenCalled()
  })

  it('снимает слушатели при размонтировании', () => {
    const outside = document.createElement('div')
    document.body.append(outside)

    const handler = vi.fn()
    const { unmount } = renderHook(() => {
      const ref = useRef<HTMLDivElement>(null)
      useClickOutside(ref, handler)
    })

    unmount()
    fireEvent.mouseDown(outside)

    expect(handler).not.toHaveBeenCalled()
  })
})
