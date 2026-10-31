import './Loader.css'

export interface LoaderProps {
  className?: string
}

export function Loader({ className }: LoaderProps) {
  const loaderClassName = className ? `loader ${className}` : 'loader'

  return (
    <span className={loaderClassName} role="status" aria-label="Загрузка">
      <span className="loader__spinner" aria-hidden="true" />
    </span>
  )
}
