import { CATALOG } from '@/shared/config'
import { useInfiniteScroll } from './useInfiniteScroll'
import { renderHook, act } from '@testing-library/react'

/** Тестовый набор: 10 карточек, при batch=6 хватит на две порции (6 + 4) */
const items = Array.from({ length: 10 }, (_, index) => ({
  id: index + 1,
}))

describe('useInfiniteScroll', () => {
  it('показывает первую порцию карточек', () => {
    const { result } = renderHook(() =>
      useInfiniteScroll(items, CATALOG.SCROLL_BATCH, CATALOG.SCROLL_DELAY_MS),
    )

    expect(result.current.visibleItems).toHaveLength(CATALOG.SCROLL_BATCH)
  })

  it('загружает следующую порцию карточек', () => {
    // включаем фейковые таймеры
    vi.useFakeTimers()
    // переменную, в которой храним callback наблюдателя.
    let observerCallback!: IntersectionObserverCallback

    // добавляем глобальный IntersectionObserver в тестовое окружение jsdom
    vi.stubGlobal(
      'IntersectionObserver',
      vi.fn((callback) => {
        observerCallback = callback

        return {
          observe: vi.fn(),
          disconnect: vi.fn(),
          unobserve: vi.fn(),
        }
      }),
    )
    // вызываем хук
    const { result, rerender } = renderHook(
      ({ items }) => useInfiniteScroll(items, CATALOG.SCROLL_BATCH, CATALOG.SCROLL_DELAY_MS),
      { initialProps: { items: [] as typeof items } },
    )

    // renderHook не рендерит разметку — подсовываем sentinelRef вручную
    const mutableRef = result.current.sentinelRef as { current: HTMLDivElement | null }

    // renderHook не рендерит разметку — подсовываем sentinelRef вручную
    act(() => {
      mutableRef.current = document.createElement('div')
    })

    rerender({ items })

    // Сообщаем наблюдателю, что маркер попал в область видимости
    act(() => {
      observerCallback(
        [{ isIntersecting: true } as IntersectionObserverEntry],
        {} as IntersectionObserver,
      )
    })

    // перематываем фейковый таймер вперед
    act(() => {
      vi.advanceTimersByTime(CATALOG.SCROLL_DELAY_MS)
    })

    // Проверяем, что хук загрузил все 10 карточек.
    expect(result.current.isLoading).toBe(false)

    // возвращаем тестовую среду в исходное состояние
    vi.useRealTimers()
    vi.unstubAllGlobals()
  })

  it('не загружает карточки, если больше нет', () => {
    // следим, что IntersectionObserver вообще не создаётся
    const observerSpy = vi.fn()
    vi.stubGlobal('IntersectionObserver', observerSpy)

    // меньше, чем batch (6) — значит hasMore = false с самого старта
    const fewItems = [{ id: 1 }, { id: 2 }, { id: 3 }]

    const { result } = renderHook(() =>
      useInfiniteScroll(fewItems, CATALOG.SCROLL_BATCH, CATALOG.SCROLL_DELAY_MS),
    )

    // все карточки видны сразу, грузить больше нечего
    expect(result.current.hasMore).toBe(false)
    expect(result.current.visibleItems).toHaveLength(3)
    expect(result.current.isLoading).toBe(false)

    // эффект обсервера вышел по !hasMore — наблюдатель не создавался
    expect(observerSpy).not.toHaveBeenCalled()

    vi.unstubAllGlobals()
  })
})
