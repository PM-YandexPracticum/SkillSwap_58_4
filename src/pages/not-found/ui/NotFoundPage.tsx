import { useNavigate } from 'react-router-dom'

import { ROUTES } from '@/shared/config'
import errorImage from '@/shared/assets/images/error-404.svg'
import { ErrorActions, ErrorPage } from '@/shared/ui/ErrorPage'

/** Заголовок по макету «404» (1:2048) */
const TITLE = 'Страница не найдена'

/** Подзаголовок по макету «404» (1:2048) */
const DESCRIPTION =
  'К сожалению, эта страница недоступна. Вернитесь на главную страницу или попробуйте позже'

/**
 * Ошибка 404 — любой неизвестный адрес и несуществующий навык.
 * «Сообщить об ошибке» — заглушка по ТЗ, «На главную» ведёт на `/`.
 * @see Figma: «404» (1:2048)
 */
export function NotFoundPage() {
  const navigate = useNavigate()

  return (
    <ErrorPage
      title={TITLE}
      description={DESCRIPTION}
      errorImage={errorImage}
      errorType="404"
      actions={<ErrorActions onHome={() => navigate(ROUTES.HOME)} />}
    />
  )
}
