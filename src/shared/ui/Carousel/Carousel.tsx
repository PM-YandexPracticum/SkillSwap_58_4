import {
  Children,
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
  type ReactNode,
} from 'react'
import useEmblaCarousel, { type UseEmblaCarouselType } from 'embla-carousel-react'

import styles from './Carousel.module.css'

export type EmblaApi = UseEmblaCarouselType[1]

export interface CarouselProps {
  /** Слайды карусели. Может быть передан один элемент или массив элементов */
  children: ReactNode
  /** Количество видимых слайдов одновременно (по умолчанию 1) */
  slidesToShow?: number
  /** Отступ между слайдами в пикселях (по умолчанию 24) */
  gap?: number
  /** Дополнительный CSS-класс для корневого контейнера */
  className?: string
  /** Показывать ли стрелки навигации (по умолчанию true) */
  showArrows?: boolean
  /** Растягивать карусель и слайды на всю высоту родителя (по умолчанию false) */
  fullHeight?: boolean
  /** Зациклить прокрутку (по умолчанию false) */
  loop?: boolean
  /** Колбэк, вызываемый при инициализации/переинициализации API embla */
  onApiReady?: (api: EmblaApi) => void
  /** Индекс активного слайда: при инициализации, смене слайда и reInit */
  onSelect?: (index: number) => void
}

/**
 * Карусель на основе библиотеки `embla-carousel-react`.
 *
 * Оборачивает логику листания библиотеки, предоставляя готовый компонент
 * со стилизованными стрелками навигации (круглые кнопки с иконкой `chevron-right`).
 * Левая стрелка получается поворотом той же иконки на 180°.
 *
 * @see Figma: в превью навыка 1:1851
 * @see Figma: на странице навыка 1:2800
 * @see Figma: в «Похожие предложения» 1:2812
 */
export function Carousel({
  children,
  slidesToShow = 1,
  gap = 24,
  className,
  showArrows = true,
  fullHeight = false,
  loop = false,
  onApiReady,
  onSelect: onSelectProp,
}: CarouselProps) {
  const [emblaRef, emblaApi] = useEmblaCarousel({
    align: 'start',
    containScroll: 'trimSnaps',
    slidesToScroll: 1,
    loop,
  })

  const [prevBtnEnabled, setPrevBtnEnabled] = useState(false)
  const [nextBtnEnabled, setNextBtnEnabled] = useState(false)

  const scrollPrev = useCallback(() => emblaApi && emblaApi.scrollPrev(), [emblaApi])
  const scrollNext = useCallback(() => emblaApi && emblaApi.scrollNext(), [emblaApi])

  // Смена callback не должна переинициализировать подписки и повторно сообщать о выборе.
  const callbacks = useRef({ onApiReady, onSelect: onSelectProp })
  useLayoutEffect(() => {
    callbacks.current = { onApiReady, onSelect: onSelectProp }
  }, [onApiReady, onSelectProp])

  useEffect(() => {
    if (!emblaApi) return
    const select = () => {
      setPrevBtnEnabled(emblaApi.canScrollPrev())
      setNextBtnEnabled(emblaApi.canScrollNext())
      callbacks.current.onSelect?.(emblaApi.selectedScrollSnap())
    }
    const ready = () => {
      callbacks.current.onApiReady?.(emblaApi)
      select()
    }
    ready()
    emblaApi.on('select', select)
    emblaApi.on('reInit', ready)
    return () => {
      emblaApi.off('select', select)
      emblaApi.off('reInit', ready)
    }
  }, [emblaApi])

  return (
    <div
      className={[styles.carousel, fullHeight ? styles.carouselFullHeight : '', className ?? '']
        .filter(Boolean)
        .join(' ')}
    >
      <div className={styles.viewport} ref={emblaRef}>
        <div className={styles.container} style={{ gap: `${gap}px` }}>
          {Children.map(children, (child) => (
            <div
              className={styles.slide}
              style={{
                flex: `0 0 calc((100% - ${gap * (slidesToShow - 1)}px) / ${slidesToShow})`,
              }}
            >
              {child}
            </div>
          ))}
        </div>
      </div>

      {showArrows && (
        <>
          <button
            type="button"
            aria-label="Предыдущий слайд"
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
            aria-label="Следующий слайд"
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
        </>
      )}
    </div>
  )
}
