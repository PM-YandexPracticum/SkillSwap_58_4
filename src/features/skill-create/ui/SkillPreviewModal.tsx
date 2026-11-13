import { useState } from 'react'

import EditIcon from '@/shared/assets/icons/edit.svg?react'
import { resolveImageUrl } from '@/shared/lib/image'
import { Button } from '@/shared/ui/Button'
import { Carousel, type EmblaApi } from '@/shared/ui/Carousel'
import { Modal } from '@/shared/ui/Modal'

import styles from './SkillPreviewModal.module.css'

/** Данные навыка для превью; названия категорий приходят готовыми — справочник окно не знает. */
export interface SkillPreviewData {
  title: string
  description: string
  categoryTitle: string
  subcategoryTitle: string
}

export interface SkillPreviewModalProps {
  isOpen: boolean
  skill: SkillPreviewData
  /** Адреса фото для галереи (`blob:`, `data:` или путь из «базы»); сама галерея ничего не создаёт и не загружает */
  images: readonly string[]
  /** «Редактировать», Esc и клик по фону: окно закрывается, пользователь возвращается к форме */
  onEdit: () => void
  /** «Готово»: регистрация завершается (P6-06) */
  onConfirm: () => void
}

/** Сколько мини-превью показывается справа от главного фото; на последнем — «+N» с остатком */
const MINI_PREVIEWS = 3

/**
 * Превью созданного навыка на шаге 3: по центру «Ваше предложение» и «Пожалуйста, проверьте и подтвердите
 * правильность данных»; слева название, «Категория / Подкатегория», описание и кнопки «Редактировать ✎» / «Готово»;
 * справа галерея: главное фото (Carousel) и колонка мини-превью, как на странице навыка. При одном фото — просто картинка.
 * «Редактировать» (а также Esc и клик по фону) закрывает окно и возвращает к форме, «Готово» завершает регистрацию.
 * Построено на `shared/ui/Modal`; внутренние отступы задаёт содержимое, высокое окно прокручивается само.
 * @see Figma: «Регистрация 3 шаг - модальное окно ваше предложение» (1:1799)
 */
export function SkillPreviewModal({
  isOpen,
  skill,
  images,
  onEdit,
  onConfirm,
}: SkillPreviewModalProps) {
  const [mainApi, setMainApi] = useState<EmblaApi>()
  const categories = [skill.categoryTitle, skill.subcategoryTitle].filter(Boolean).join(' / ')
  const hiddenCount = images.length - MINI_PREVIEWS

  // Карусель получает слайды отдельными элементами, а не одним вложенным массивом
  const slides = images.map((image, index) => (
    <img
      key={`${index}-${image}`}
      className={styles.image}
      src={resolveImageUrl(image, 'SKILL')}
      alt={`${skill.title || 'Навык'} — фото ${index + 1}`}
    />
  ))

  return (
    <Modal isOpen={isOpen} onClose={onEdit} ariaLabel="Ваше предложение">
      <div className={styles.content}>
        <header className={styles.header}>
          <h2 className={styles.title}>Ваше предложение</h2>
          <p className={styles.subtitle}>Пожалуйста, проверьте и подтвердите правильность данных</p>
        </header>
        <div className={styles.body}>
          <div className={styles.info}>
            <div className={styles.text}>
              <div className={styles.heading}>
                <h3 className={styles.skillTitle}>{skill.title}</h3>
                {categories && <p className={styles.categories}>{categories}</p>}
              </div>
              <p className={styles.description}>{skill.description}</p>
            </div>
            <div className={styles.actions}>
              <Button variant="secondary" onClick={onEdit}>
                Редактировать
                <EditIcon className={styles.icon} aria-hidden="true" />
              </Button>
              <Button onClick={onConfirm}>Готово</Button>
            </div>
          </div>
          {images.length > 0 && (
            <div className={styles.gallery}>
              <div className={styles.main}>
                {images.length > 1 ? (
                  <Carousel onApiReady={setMainApi}>{slides}</Carousel>
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
                            ? `Показать фото ${index + 1}, ещё ${hiddenCount}`
                            : `Показать фото ${index + 1}`
                        }
                        onClick={() => mainApi?.scrollTo(index)}
                      >
                        <img
                          className={styles.miniImage}
                          src={resolveImageUrl(image, 'SKILL')}
                          alt=""
                        />
                        {hasRest && (
                          <>
                            <span className={styles.miniOverlay} />
                            <span className={styles.miniLabel}>{`+${hiddenCount}`}</span>
                          </>
                        )}
                      </button>
                    )
                  })}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </Modal>
  )
}
