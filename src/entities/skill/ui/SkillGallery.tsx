import { useState } from 'react'

import { resolveImageUrl } from '@/shared/lib/image'
import { Carousel, type EmblaApi } from '@/shared/ui/Carousel'

import styles from './SkillGallery.module.css'

export interface SkillGalleryProps {
  /** Название навыка для доступных подписей фотографий. */
  title: string
  /** Пути из базы или локальные data:/blob: превью; файлы здесь не читаются. */
  images: readonly string[]
}

const MINI_PREVIEWS = 3

/**
 * Одинаковая галерея страницы навыка и превью регистрации: фото 324 × 324,
 * до трёх миниатюр 92 × 92 и остаток «+N». Без фото ничего не выводит,
 * с одним фото не создаёт карусель. Листанием и событиями управляет общий Carousel.
 * @see Figma: превью 1:1799, страница навыка 1:2764.
 */
export function SkillGallery({ title, images }: SkillGalleryProps) {
  const [mainApi, setMainApi] = useState<EmblaApi>()
  if (images.length === 0) return null

  const hiddenCount = images.length - MINI_PREVIEWS
  const slides = images.map((image, index) => (
    <img
      key={`${index}-${image}`}
      className={styles.image}
      src={resolveImageUrl(image, 'SKILL')}
      alt={`${title || 'Навык'} — фото ${index + 1}`}
    />
  ))

  return (
    <div className={styles.gallery}>
      <div className={styles.main}>
        {images.length > 1 ? (
          <Carousel fullHeight onApiReady={setMainApi}>
            {slides}
          </Carousel>
        ) : (
          slides
        )}
      </div>
      {images.length > 1 && (
        <div className={styles.minis}>
          {images.slice(0, MINI_PREVIEWS).map((image, index) => {
            const hasRest = index === MINI_PREVIEWS - 1 && hiddenCount > 0
            return (
              <button
                key={`${index}-${image}`}
                type="button"
                className={styles.mini}
                aria-label={
                  hasRest
                    ? `Показать фото ${index + 1}, ещё ${hiddenCount} фото`
                    : `Показать фото ${index + 1}`
                }
                onClick={() => mainApi?.scrollTo(index)}
              >
                <img className={styles.miniImage} src={resolveImageUrl(image, 'SKILL')} alt="" />
                {hasRest && (
                  <>
                    <span className={styles.miniOverlay} />
                    <span className={styles.miniLabel}>+{hiddenCount}</span>
                  </>
                )}
              </button>
            )
          })}
        </div>
      )}
    </div>
  )
}
