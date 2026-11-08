import { useNavigate } from 'react-router-dom'

import { ROUTES } from '@/shared/config'
import errorImage from '@/shared/assets/images/error-404.svg'
import { Button } from '@/shared/ui/Button'
import styles from './NotFoundPage.module.css'

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
    <main className={styles.page}>
      <div className={styles.content}>
        <img
          className={styles.image}
          src={errorImage}
          alt="Монитор с надписью 404 ERROR"
          width={460}
          height={304}
        />
        <div className={styles.text}>
          <h1 className={styles.title}>{TITLE}</h1>
          <p className={styles.description}>{DESCRIPTION}</p>
        </div>
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
