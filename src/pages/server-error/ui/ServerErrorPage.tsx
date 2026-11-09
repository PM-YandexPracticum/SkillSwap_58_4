import { useNavigate } from 'react-router-dom'

import { ROUTES } from '@/shared/config'
import errorImage from '@/shared/assets/images/error-500.svg'
import { Button } from '@/shared/ui/Button'
import styles from './ServerErrorPage.module.css'
import { ErrorPage } from '@/shared/ui/ErrorPage'

/** Заголовок по макету «500» (1:2077) */
const TITLE = 'На сервере произошла ошибка'

/** Подзаголовок по макету «500» (1:2077) — одна строка */
const DESCRIPTION = 'Попробуйте позже или вернитесь на главную страницу'

/**
 * Ошибка 500 — внутренняя ошибка сервера. Показывается из ErrorBoundary при падении.
 * Структура та же, что у 404: картинка, заголовок, описание, две кнопки.
 * «Сообщить об ошибке» — заглушка по ТЗ, «На главную» ведёт на `/`.
 * Обязательна по ТЗ, хотя без бекенда её почти не увидеть.
 * @see Figma: «500» (1:2077)
 */
export function ServerErrorPage() {
  const navigate = useNavigate()

  return (
    <main className={styles.page}>
      <div className={styles.content}>
        <ErrorPage errorImage={errorImage} title={TITLE} description={DESCRIPTION} errorType='500'/>
        <div className={styles.actions}>
          <Button variant="secondary" onClick={() => {}}>
            Сообщить об ошибке
          </Button>
          <Button variant="primary" onClick={() => navigate(ROUTES.HOME)}>
            На главную
          </Button>
        </div>
      </div>
    </main>
  )
}
