import { useCallback, useEffect, useState, type ReactNode } from 'react'
import useEmblaCarousel from 'embla-carousel-react'

import styles from './Carousel.module.css'

export interface CarouselProps {
  children: ReactNode
  slidesToShow?: number
  gap?: number
  className?: string
}

export function Carousel({ children, slidesToShow = 1, gap = 16, className }: CarouselProps) {
  const [emblaRef, emblaApi] = useEmblaCarousel({
    align: 'start',
    containScroll: 'trimSnaps',
    slidesToScroll: 1,
  })

  const [prevBtnEnabled, setPrevBtnEnabled] = useState(false)
  const [nextBtnEnabled, setNextBtnEnabled] = useState(false)

  const scrollPrev = useCallback(() => emblaApi && emblaApi.scrollPrev(), [emblaApi])
  const scrollNext = useCallback(() => emblaApi && emblaApi.scrollNext(), [emblaApi])

  const onSelect = useCallback(() => {
    if (!emblaApi) return
    setPrevBtnEnabled(emblaApi.canScrollPrev())
    setNextBtnEnabled(emblaApi.canScrollNext())
  }, [emblaApi])

  useEffect(() => {
    if (!emblaApi) return
    onSelect()
    emblaApi.on('select', onSelect)
    emblaApi.on('reInit', onSelect)
  }, [emblaApi, onSelect])

  return (
    <div className={`${styles.carousel} ${className ?? ''}`}>
      <div className={styles.viewport} ref={emblaRef}>
        <div className={styles.container} style={{ gap: `${gap}px` }}>
          {Array.isArray(children) ? (
            children.map((child, index) => (
              <div
                key={index}
                className={styles.slide}
                style={{
                  flex: `0 0 calc((100% - ${gap * (slidesToShow - 1)}px) / ${slidesToShow})`,
                }}
              >
                {child}
              </div>
            ))
          ) : (
            <div className={styles.slide} style={{ flex: `0 0 100%` }}>
              {children}
            </div>
          )}
        </div>
      </div>

      <button
        type="button"
        data-testid="carousel-prev"
        className={`${styles.arrow} ${styles.arrowPrev}`}
        onClick={scrollPrev}
        disabled={!prevBtnEnabled}
      >
        <img
          src={new URL('@/shared/assets/icons/chevron-right.svg', import.meta.url).href}
          alt=""
          className={styles.arrowIconLeft}
        />
      </button>
      <button
        type="button"
        data-testid="carousel-next"
        className={`${styles.arrow} ${styles.arrowNext}`}
        onClick={scrollNext}
        disabled={!nextBtnEnabled}
      >
        <img
          src={new URL('@/shared/assets/icons/chevron-right.svg', import.meta.url).href}
          alt=""
          className={styles.arrowIcon}
        />
      </button>
    </div>
  )
}
