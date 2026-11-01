import styles from './Loader.module.css'

export interface LoaderProps {
  /** Дополнительный класс — например, чтобы поставить спиннер по центру блока */
  className?: string
}

/**
 * Спиннер «загружается»: показываем, пока грузятся данные и пока догружается лента карточек.
 *
 * Для скринридера — `role="status"` и подпись «Загрузка».
 * Если в системе отключена анимация, спиннер не крутится.
 */
export function Loader({ className }: LoaderProps) {
  const loaderClassName = [styles.loader, className].filter(Boolean).join(' ')

  return (
    <span className={loaderClassName} role="status" aria-label="Загрузка">
      <span className={styles.spinner} aria-hidden="true" />
    </span>
  )
}
