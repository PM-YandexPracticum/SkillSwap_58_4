import { useState, type MouseEvent } from 'react'

import styles from './Tag.module.css'

export type TagColor =
  | 'business'
  | 'creativity'
  | 'languages'
  | 'education'
  | 'health'
  | 'home'
  | 'more'

const CATEGORY_COLOR_VAR: Record<TagColor, string> = {
  business: 'var(--color-tag-business)',
  creativity: 'var(--color-tag-art)',
  languages: 'var(--color-tag-language)',
  education: 'var(--color-tag-education)',
  health: 'var(--color-tag-health)',
  home: 'var(--color-tag-home)',
  more: 'var(--color-tag-more)',
}

/** Есть ли такой цвет у чипа — id категории из данных (`business`, `languages`…) или `more` */
export function isTagColor(value: string): value is TagColor {
  // Собственное свойство, а не `in`: иначе «toString» и «constructor» тоже сочлись бы цветами
  return Object.prototype.hasOwnProperty.call(CATEGORY_COLOR_VAR, value)
}

export interface TagProps {
  label: string
  /** filter — крупная прямоугольная плашка каталога; chip — компактный чип навыка. */
  variant?: 'chip' | 'filter'
  /** Семантический цвет, приходит снаружи */
  color?: TagColor
  /** Есть — показываем крестик, по клику плашка удаляется */
  onRemove?: () => void
}

/**
 * Цветной чип: навык на карточке («Игра на барабанах», «+2») или «плашка» с крестиком (`onRemove`).
 * В узком месте длинное название обрезается многоточием; при наведении мышью тогда видна подсказка
 * с полным названием. Скринридер читает название целиком и без подсказки.
 * @see Figma: чипы на карточке (1:2861), плашки фильтров (1:2860)
 */
export function Tag({ label, color, onRemove, variant = 'chip' }: TagProps) {
  // Подсказку решаем показывать при наведении: только тогда известно, обрезан ли текст на самом деле
  const [hint, setHint] = useState<string | undefined>(undefined)

  const showHintIfTruncated = (event: MouseEvent<HTMLSpanElement>) => {
    const { scrollWidth, clientWidth } = event.currentTarget
    setHint(scrollWidth > clientWidth ? label : undefined)
  }

  return (
    <div
      className={[styles.tag, variant === 'filter' && styles.filter].filter(Boolean).join(' ')}
      style={{ backgroundColor: color ? CATEGORY_COLOR_VAR[color] : 'var(--color-bg-secondary)' }}
    >
      <span className={styles.label} title={hint} onMouseEnter={showHintIfTruncated}>
        {label}
      </span>

      {onRemove && (
        <button
          type="button"
          className={styles.removeButton}
          onClick={onRemove}
          aria-label={`Удалить ${label}`}
        >
          <svg
            width={variant === 'filter' ? 24 : 12}
            height={variant === 'filter' ? 24 : 12}
            viewBox="0 0 12 12"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M9 3L3 9M3 3L9 9"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>
      )}
    </div>
  )
}
