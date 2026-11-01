import styles from './Tag.module.css'

export interface TagProps {
  label: string
  color?: string
  onRemove?: () => void
}

/**
 * Цветной чип: навык на карточке («Игра на барабанах», «+2») или «плашка» с крестиком —
 * выбранный фильтр над результатами и выбранное «Хочу научиться» на шаге 2 регистрации (тот же компонент).
 * Цвет зависит от категории.
 * @see Figma: 1:2861 (чипы на карточке), 1:2860 (плашки фильтров)
 */
export function Tag({ label, color, onRemove }: TagProps) {
  return (
    <div className={styles.tag} style={{ backgroundColor: color }}>
      <span>{label}</span>

      {onRemove && (
        <button
          type="button"
          className={styles.removeButton}
          onClick={onRemove}
          aria-label={`Удалить фильтр ${label}`}
        >
          <svg
            width="12"
            height="12"
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
