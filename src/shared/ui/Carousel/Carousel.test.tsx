import { fireEvent, render, screen } from '@testing-library/react'
import { vi, describe, it, expect, beforeEach } from 'vitest'
import { Carousel } from './Carousel'
import useEmblaCarousel, { type UseEmblaCarouselType } from 'embla-carousel-react'

vi.mock('embla-carousel-react', () => ({
  default: vi.fn(),
}))

// Тип API, который возвращает хук
type EmblaApi = UseEmblaCarouselType[1]

describe('Carousel', () => {
  const scrollPrev = vi.fn()
  const scrollNext = vi.fn()
  const on = vi.fn()
  const off = vi.fn()

  // Мок API с использованием unknown (без any)
  const mockEmblaApi = {
    scrollPrev,
    scrollNext,
    canScrollPrev: () => true,
    canScrollNext: () => true,
    on,
    off,
    reInit: vi.fn(),
    selectedScrollSnap: () => 0,
  } as unknown as EmblaApi

  beforeEach(() => {
    vi.clearAllMocks()

    // Возвращаем кортеж без any
    vi.mocked(useEmblaCarousel).mockReturnValue([vi.fn(), mockEmblaApi])
  })

  const slides = [
    <div key="1">Слайд 1</div>,
    <div key="2">Слайд 2</div>,
    <div key="3">Слайд 3</div>,
  ]

  it('рендерит все слайды', () => {
    render(<Carousel slidesToShow={2}>{slides}</Carousel>)

    expect(screen.getByText('Слайд 1')).toBeInTheDocument()
    expect(screen.getByText('Слайд 2')).toBeInTheDocument()
    expect(screen.getByText('Слайд 3')).toBeInTheDocument()
  })

  it('показывает кнопки навигации', () => {
    render(<Carousel slidesToShow={1}>{slides}</Carousel>)

    expect(screen.getByTestId('carousel-prev')).toBeInTheDocument()
    expect(screen.getByTestId('carousel-next')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Предыдущий слайд' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Следующий слайд' })).toBeInTheDocument()
  })

  it('вызывает scrollPrev и scrollNext при клике на стрелки', () => {
    render(<Carousel slidesToShow={1}>{slides}</Carousel>)

    const prevBtn = screen.getByTestId('carousel-prev')
    const nextBtn = screen.getByTestId('carousel-next')

    fireEvent.click(prevBtn)
    fireEvent.click(nextBtn)

    expect(scrollPrev).toHaveBeenCalledTimes(1)
    expect(scrollNext).toHaveBeenCalledTimes(1)
  })

  it('disabled кнопки, когда листать некуда', () => {
    // Эмулируем вызов onSelect при подписке на событие 'select',
    // чтобы состояние кнопок реально обновилось через onSelect
    const on = vi.fn((event: string, cb: () => void) => {
      if (event === 'select') cb()
    })
    const api = {
      ...mockEmblaApi,
      canScrollPrev: () => false,
      canScrollNext: () => false,
      on,
    } as unknown as EmblaApi

    vi.mocked(useEmblaCarousel).mockReturnValue([vi.fn(), api])
    render(<Carousel>{slides}</Carousel>)

    expect(screen.getByTestId('carousel-prev')).toBeDisabled()
    expect(screen.getByTestId('carousel-next')).toBeDisabled()
  })

  it('отписывается от событий при размонтировании', () => {
    const off = vi.fn()
    vi.mocked(useEmblaCarousel).mockReturnValue([
      vi.fn(),
      { ...mockEmblaApi, off } as unknown as EmblaApi,
    ])
    const { unmount } = render(<Carousel>{slides}</Carousel>)
    unmount()
    expect(off).toHaveBeenCalledWith('select', expect.any(Function))
    expect(off).toHaveBeenCalledWith('reInit', expect.any(Function))
  })

  it('рассчитывает ширину слайда с учётом slidesToShow и gap', () => {
    render(
      <Carousel slidesToShow={2} gap={16}>
        {slides}
      </Carousel>,
    )
    const slide = screen.getByText('Слайд 1').parentElement
    expect(slide).toHaveStyle({
      flex: '0 0 calc((100% - 16px) / 2)',
    })
  })
})
