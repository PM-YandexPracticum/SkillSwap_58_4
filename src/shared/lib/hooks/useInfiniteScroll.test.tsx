import { StrictMode } from 'react'
import { act, cleanup, fireEvent, render, screen } from '@testing-library/react'
import { CATALOG } from '@/shared/config'
import { useInfiniteScroll } from './useInfiniteScroll'

const items = Object.freeze(Array.from({ length: 20 }, (_, index) => index + 1))

interface FeedProps {
  items: readonly number[]
  batch?: number
  delayMs?: number
  markerKey?: string
  showMarker?: boolean
}

function Feed({
  items,
  batch = CATALOG.SCROLL_BATCH,
  delayMs = CATALOG.SCROLL_DELAY_MS,
  markerKey = 'initial',
  showMarker = true,
}: FeedProps) {
  const { visibleItems, sentinelRef, isLoading, hasMore } = useInfiniteScroll(items, batch, delayMs)

  return (
    <section aria-label="Лента">
      <ol>
        {visibleItems.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ol>
      {isLoading && <p role="status">Загрузка</p>}
      {!hasMore && <p>Все карточки показаны</p>}
      {hasMore && showMarker && <div key={markerKey} ref={sentinelRef} data-testid="sentinel" />}
    </section>
  )
}

/** Управляем только событиями браузера; ref назначает React настоящему DOM-элементу. */
class ObserverMock {
  static instances: ObserverMock[] = []
  target: Element | null = null
  disconnect = vi.fn()
  observe = vi.fn((target: Element) => {
    this.target = target
  })

  constructor(private callback: IntersectionObserverCallback) {
    ObserverMock.instances.push(this)
  }

  intersect(isIntersecting = true) {
    act(() => {
      this.callback(
        [{ target: this.target, isIntersecting } as IntersectionObserverEntry],
        this as unknown as IntersectionObserver,
      )
    })
  }
}

function observer() {
  return ObserverMock.instances[ObserverMock.instances.length - 1]!
}

function scroll(target: Element | Window = window) {
  fireEvent.wheel(target)
  fireEvent.scroll(target)
}

function finishLoading(delayMs: number = CATALOG.SCROLL_DELAY_MS) {
  act(() => {
    vi.advanceTimersByTime(delayMs)
  })
}

beforeEach(() => {
  vi.useFakeTimers()
  ObserverMock.instances = []
  vi.stubGlobal('IntersectionObserver', ObserverMock)
})

afterEach(() => {
  cleanup()
  vi.clearAllTimers()
  vi.useRealTimers()
  vi.unstubAllGlobals()
  vi.restoreAllMocks()
})

describe('useInfiniteScroll', () => {
  it('сразу показывает первые шесть карточек без спиннера', () => {
    render(<Feed items={items} />)
    expect(screen.getAllByRole('listitem').map((item) => item.textContent)).toEqual([
      '1',
      '2',
      '3',
      '4',
      '5',
      '6',
    ])
    expect(screen.queryByRole('status')).not.toBeInTheDocument()
  })

  it('не догружает видимый маркер без прокрутки', () => {
    render(<Feed items={items} />)
    observer().intersect()
    finishLoading(CATALOG.SCROLL_DELAY_MS * 3)
    expect(screen.getAllByRole('listitem')).toHaveLength(6)
    expect(screen.queryByRole('status')).not.toBeInTheDocument()
  })

  it('показывает спиннер ровно на время задержки и добавляет шесть карточек', () => {
    render(<Feed items={items} />)
    scroll()
    observer().intersect()
    expect(screen.getByRole('status')).toHaveTextContent('Загрузка')
    finishLoading(CATALOG.SCROLL_DELAY_MS - 1)
    expect(screen.getAllByRole('listitem')).toHaveLength(6)
    finishLoading(1)
    expect(screen.getAllByRole('listitem')).toHaveLength(12)
    expect(screen.queryByRole('status')).not.toBeInTheDocument()
  })

  it('запускает догрузку при прокрутке уже видимого маркера', () => {
    render(<Feed items={items} />)
    observer().intersect()
    scroll()
    finishLoading()
    expect(screen.getAllByRole('listitem')).toHaveLength(12)
  })

  it('не догружает, пока маркер за пределами экрана', () => {
    render(<Feed items={items} />)
    observer().intersect(false)
    scroll()
    finishLoading()
    expect(screen.getAllByRole('listitem')).toHaveLength(6)
  })

  it('не использует устаревшую видимость маркера, если он уже ушёл за экран', () => {
    render(<Feed items={items} />)
    observer().intersect()
    vi.spyOn(screen.getByTestId('sentinel'), 'getBoundingClientRect').mockReturnValue({
      top: -100,
      bottom: -98,
    } as DOMRect)
    scroll()
    finishLoading()
    expect(screen.getAllByRole('listitem')).toHaveLength(6)
  })

  it('учитывает прокрутку вложенного контейнера', () => {
    render(<Feed items={items} />)
    observer().intersect()
    scroll(screen.getByRole('region', { name: 'Лента' }))
    finishLoading()
    expect(screen.getAllByRole('listitem')).toHaveLength(12)
  })

  it.each(['PageDown', 'End', 'ArrowDown', ' '])('догружает при прокрутке клавишей %s', (key) => {
    render(<Feed items={items} />)
    observer().intersect()
    fireEvent.keyDown(window, { key })
    fireEvent.scroll(window)
    finishLoading()
    expect(screen.getAllByRole('listitem')).toHaveLength(12)
  })

  it('поддерживает прокрутку касанием', () => {
    render(<Feed items={items} />)
    observer().intersect()
    fireEvent.touchMove(screen.getByText('6'))
    fireEvent.scroll(screen.getByRole('region', { name: 'Лента' }))
    finishLoading()
    expect(screen.getAllByRole('listitem')).toHaveLength(12)
  })

  it('поддерживает прокрутку после нажатия на полосу прокрутки', () => {
    render(<Feed items={items} />)
    observer().intersect()
    fireEvent.pointerDown(window)
    fireEvent.scroll(window)
    finishLoading()
    expect(screen.getAllByRole('listitem')).toHaveLength(12)
  })

  it('не принимает ввод обычной буквы за прокрутку', () => {
    render(<Feed items={items} />)
    observer().intersect()
    fireEvent.keyDown(window, { key: 'a' })
    fireEvent.scroll(window)
    finishLoading()
    expect(screen.getAllByRole('listitem')).toHaveLength(6)
  })

  it('учитывает колесо мыши над свободным местом страницы', () => {
    render(
      <>
        <Feed items={items} />
        <p>Свободное место</p>
      </>,
    )
    observer().intersect()
    fireEvent.wheel(screen.getByText('Свободное место'))
    fireEvent.scroll(document)
    finishLoading()
    expect(screen.getAllByRole('listitem')).toHaveLength(12)
  })

  it('не реагирует на прокрутку постороннего контейнера', () => {
    render(
      <>
        <Feed items={items} />
        <aside aria-label="Меню" />
      </>,
    )
    observer().intersect()
    scroll(screen.getByRole('complementary', { name: 'Меню' }))
    finishLoading()
    expect(screen.getAllByRole('listitem')).toHaveLength(6)
  })

  it('сохраняет прокрутку при обычном повторном рендере', () => {
    const { rerender } = render(<Feed items={items} />)
    scroll()
    rerender(<Feed items={items} />)
    observer().intersect()
    finishLoading()
    expect(screen.getAllByRole('listitem')).toHaveLength(12)
  })

  it('не запускает несколько загрузок от повторных событий', () => {
    render(<Feed items={items} />)
    const currentObserver = observer()
    scroll()
    currentObserver.intersect()
    currentObserver.intersect()
    scroll()
    finishLoading()
    expect(screen.getAllByRole('listitem')).toHaveLength(12)
  })

  it('для каждой следующей порции ждёт новую прокрутку', () => {
    render(<Feed items={items} />)
    scroll()
    observer().intersect()
    finishLoading()
    observer().intersect()
    finishLoading(CATALOG.SCROLL_DELAY_MS * 3)
    expect(screen.getAllByRole('listitem')).toHaveLength(12)
    scroll()
    finishLoading()
    expect(screen.getAllByRole('listitem')).toHaveLength(18)
  })

  it('показывает неполную последнюю порцию и останавливается', () => {
    render(<Feed items={items.slice(0, 10)} />)
    scroll()
    observer().intersect()
    finishLoading()
    expect(screen.getAllByRole('listitem')).toHaveLength(10)
    expect(screen.getByText('Все карточки показаны')).toBeInTheDocument()
    expect(screen.queryByTestId('sentinel')).not.toBeInTheDocument()
  })

  it.each([0, 3, 6])('для списка из %i карточек не запускает наблюдение', (length) => {
    render(<Feed items={items.slice(0, length)} />)
    expect(screen.queryAllByRole('listitem')).toHaveLength(length)
    expect(screen.getByText('Все карточки показаны')).toBeInTheDocument()
    expect(ObserverMock.instances).toHaveLength(0)
  })

  it('сбрасывает показанные карточки при смене фильтров', () => {
    const { rerender } = render(<Feed items={items} />)
    scroll()
    observer().intersect()
    finishLoading()
    const filtered = items.slice().reverse()
    rerender(<Feed items={filtered} />)
    expect(screen.getAllByRole('listitem').map((item) => item.textContent)).toEqual([
      '20',
      '19',
      '18',
      '17',
      '16',
      '15',
    ])
  })

  it('отменяет догрузку старого списка при смене фильтров', () => {
    const { rerender } = render(<Feed items={items} />)
    scroll()
    observer().intersect()
    finishLoading(500)
    rerender(<Feed items={items.slice().reverse()} />)
    finishLoading()
    expect(screen.getAllByRole('listitem')).toHaveLength(6)
    expect(screen.queryByRole('status')).not.toBeInTheDocument()
    expect(vi.getTimerCount()).toBe(0)
  })

  it('не догружает от автоматической коррекции scroll после смены фильтров', () => {
    const { rerender } = render(<Feed items={items} />)
    scroll()
    observer().intersect()
    finishLoading()
    rerender(<Feed items={items.slice().reverse()} />)
    fireEvent.scroll(window)
    observer().intersect()
    finishLoading()
    expect(screen.getAllByRole('listitem')).toHaveLength(6)
  })

  it('не переносит прокрутку на новый список', () => {
    const { rerender } = render(<Feed items={items} />)
    scroll()
    rerender(<Feed items={items.slice().reverse()} />)
    observer().intersect()
    finishLoading()
    expect(screen.getAllByRole('listitem')).toHaveLength(6)
  })

  it('переключает наблюдение при замене DOM-маркера без смены items', () => {
    const { rerender } = render(<Feed items={items} />)
    const previous = observer()
    rerender(<Feed items={items} markerKey="replacement" />)
    expect(previous.disconnect).toHaveBeenCalled()
    expect(observer().target).toBe(screen.getByTestId('sentinel'))
    scroll()
    observer().intersect()
    finishLoading()
    expect(screen.getAllByRole('listitem')).toHaveLength(12)
  })

  it('подключает маркер, появившийся после первого рендера', () => {
    const { rerender } = render(<Feed items={items} showMarker={false} />)
    expect(ObserverMock.instances).toHaveLength(0)
    rerender(<Feed items={items} />)
    scroll()
    observer().intersect()
    finishLoading()
    expect(screen.getAllByRole('listitem')).toHaveLength(12)
  })

  it('игнорирует запоздалое событие отключённого observer', () => {
    const { rerender } = render(<Feed items={items} />)
    const previous = observer()
    rerender(<Feed items={items} markerKey="replacement" />)
    scroll()
    previous.intersect()
    finishLoading()
    expect(screen.getAllByRole('listitem')).toHaveLength(6)
  })

  it('при изменении размера порции начинает ленту заново', () => {
    const { rerender } = render(<Feed items={items} />)
    scroll()
    observer().intersect()
    rerender(<Feed items={items} batch={4} />)
    finishLoading()
    expect(screen.getAllByRole('listitem')).toHaveLength(4)
    expect(screen.queryByRole('status')).not.toBeInTheDocument()
  })

  it('использует переданные размер порции и задержку', () => {
    render(<Feed items={items} batch={4} delayMs={200} />)
    scroll()
    observer().intersect()
    finishLoading(199)
    expect(screen.getAllByRole('listitem')).toHaveLength(4)
    finishLoading(1)
    expect(screen.getAllByRole('listitem')).toHaveLength(8)
  })

  it('при размонтировании очищает таймер и отключает наблюдение', () => {
    const { unmount } = render(<Feed items={items} />)
    scroll()
    observer().intersect()
    unmount()
    finishLoading()
    expect(vi.getTimerCount()).toBe(0)
    expect(
      ObserverMock.instances.every((instance) => instance.disconnect.mock.calls.length > 0),
    ).toBe(true)
  })

  it('после размонтирования не обрабатывает scroll и запоздалый callback', () => {
    const { unmount } = render(<Feed items={items} />)
    const previous = observer()
    unmount()
    scroll()
    previous.intersect()
    expect(vi.getTimerCount()).toBe(0)
  })

  it('при смене задержки перезапускает текущий таймер', () => {
    const { rerender } = render(<Feed items={items} />)
    scroll()
    observer().intersect()
    finishLoading(500)
    rerender(<Feed items={items} delayMs={200} />)
    finishLoading(199)
    expect(screen.getAllByRole('listitem')).toHaveLength(6)
    finishLoading(1)
    expect(screen.getAllByRole('listitem')).toHaveLength(12)
    expect(vi.getTimerCount()).toBe(0)
  })

  it('работает в StrictMode без двойной догрузки', () => {
    render(
      <StrictMode>
        <Feed items={items} />
      </StrictMode>,
    )
    scroll()
    observer().intersect()
    finishLoading()
    expect(screen.getAllByRole('listitem')).toHaveLength(12)
  })

  it('сохраняет действующее наблюдение при рендере с тем же маркером', () => {
    const { rerender } = render(<Feed items={items} />)
    const initial = observer()
    initial.intersect()
    rerender(<Feed items={items} />)
    expect(observer()).toBe(initial)
    expect(initial.disconnect).not.toHaveBeenCalled()
    scroll()
    finishLoading()
    expect(screen.getAllByRole('listitem')).toHaveLength(12)
  })
})
