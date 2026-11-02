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
  } as unknown as EmblaApi

  beforeEach(() => {
    vi.clearAllMocks()

    // Возвращаем кортеж без any
    vi.mocked(useEmblaCarousel).mockReturnValue([
      vi.fn(),
      mockEmblaApi,
    ])
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
})
