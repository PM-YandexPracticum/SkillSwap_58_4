import styles from './Loader.module.css'

export interface LoaderProps {
  className?: string
}

export function Loader({ className }: LoaderProps) {
  const loaderClassName = [styles.loader, className].filter(Boolean).join(' ')

  return (
    <span className={loaderClassName} role="status" aria-label="Загрузка">
      <span className={styles.spinner} aria-hidden="true" />
    </span>
  )
}
