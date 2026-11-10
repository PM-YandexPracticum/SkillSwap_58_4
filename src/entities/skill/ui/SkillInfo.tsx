import { useState, type ReactNode } from 'react'
import { Carousel, type EmblaApi } from '@/shared/ui/Carousel'
import type { Skill } from '../model/types'

import styles from './SkillInfo.module.css'

export type SkillInfoActions = Partial<Record<'like' | 'createOffer' | 'share' | 'more', ReactNode>>

export interface SkillInfoProps {
  skill: Pick<Skill, 'title' | 'description' | 'images'>
  categoryTitle: string
  subcategoryTitle: string
  actions?: SkillInfoActions
}

export function SkillInfo(_props: SkillInfoProps) {
  const [mainApi, setMainApi] = useState<EmblaApi>();

  const scrollTo = (index: number) => {
    mainApi?.scrollTo(index);
  }

  // Обертка для слайдов карусели.
  // Важно: Carousel должен получать слайды как отдельные элементы.
  const getSkillImages = (images: string[]): ReactNode => {
    return images.map((image, index) => (
      <div key={index} className={styles.carouselSlide}>
        <img src={image} alt="" className={styles.image} />
      </div>
    ));
  }

  const getMiniPreview = (images: string[]): ReactNode => {
    const hasMoreThanThree = images.length > 3;

    return images.map((image, index) => {
      // Показываем только первые 3 превью
      if (index > 2) return null;

      const isThirdWithOverlay = index === 2 && hasMoreThanThree;

      return (
        <button
          key={index}
          className={styles.miniPreviewWrapper}
          onClick={() => scrollTo(index)}
          type="button"
        >
          <img src={image} alt="" className={styles.previewImage} />
          {isThirdWithOverlay && (
            <>
              <div className={styles.miniPreviewOverlay} />
              <p className={styles.miniPreviewLabel}>{`+${images.length - 3}`}</p>
            </>
          )}
        </button>
      )
    });
  }

  return (
    <article className={styles.card}>
      <div className={styles.action}>
        {_props.actions?.like}
        {_props.actions?.share}
        {_props.actions?.more}
      </div>
      <div className={styles.container}>
        <section className={styles.content}>
          <div className={styles.skill}>
            <h1 className={styles.skillName}>{_props.skill.title}</h1>
            <p className={styles.categories}>
              {`${_props.categoryTitle} / ${_props.subcategoryTitle}`}
            </p>
          </div>
          <p className={styles.skillDescription}>{_props.skill.description}</p>
          {_props.actions?.createOffer && (
            <div className={styles.actionCreateOffer}>{_props.actions?.createOffer}</div>
          )}
        </section>
        <div className={styles.gallery}>
          <Carousel onApiReady={setMainApi} className={styles.galleryCarousel}>
            {getSkillImages(_props.skill.images)}
          </Carousel>
          <div className={styles.miniPreview}>
            {getMiniPreview(_props.skill.images)}
          </div>
        </div>
      </div>
    </article>
  )
}
