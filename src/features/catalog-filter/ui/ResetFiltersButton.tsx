import styles from './ResetFiltersButton.module.css'

export interface ResetFiltersButtonProps {
  className?: string
  onClick?: () => void
}

export function ResetFiltersButton({ className, onClick }: ResetFiltersButtonProps) {
  return (
    <button
      type="button"
      className={[styles.button, className].filter(Boolean).join(' ')}
      onClick={onClick}
    >
      Сбросить
      <svg
        className={styles.icon}
        xmlns="http://www.w3.org/2000/svg"
        fill="currentColor"
        viewBox="0 0 24 24"
        aria-hidden="true"
      >
        <path d="M16.744 8.288 8.26 16.773c-.29.29-.77.29-1.06 0a.755.755 0 0 1 0-1.06l8.485-8.486c.29-.29.77-.29 1.06 0s.29.77 0 1.06" />
        <path d="M16.744 16.773c-.29.29-.77.29-1.06 0L7.198 8.288a.755.755 0 0 1 0-1.061c.29-.29.771-.29 1.061 0l8.485 8.485c.29.29.29.77 0 1.06" />
      </svg>
    </button>
  )
}
