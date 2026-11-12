import errorImage from '@/shared/assets/images/error-500.svg'
import { ErrorActions, ErrorPage } from '@/shared/ui/ErrorPage'

/** Заголовок по макету «500» (1:2077) */
const TITLE = 'На сервере произошла ошибка'

/** Подзаголовок по макету «500» (1:2077) — одна строка */
const DESCRIPTION = 'Попробуйте позже или вернитесь на главную страницу'

export interface ServerErrorViewProps {
  /** Возврат на главную: маршрут или перезапуск приложения после сбоя. */
  onHome: () => void
}

/**
 * Содержимое страницы 500 без зависимости от роутера и Redux.
 * Используется маршрутом /500 и корневым ErrorBoundary; способ возврата задаёт вызывающий код.
 * @see Figma: «500» (1:2077)
 */
export function ServerErrorView({ onHome }: ServerErrorViewProps) {
  return (
    <ErrorPage
      errorImage={errorImage}
      title={TITLE}
      description={DESCRIPTION}
      errorType="500"
      actions={<ErrorActions onHome={onHome} />}
    />
  )
}
