import type { ReactNode } from 'react'

import styles from './ErrorPage.module.css'

export interface ErrorPageProps {
  errorImage: string
  title: string
  description: string
  errorType: '500' | '404'
  actions?: ReactNode
}

const chooseAlt = (errorType: ErrorPageProps['errorType']): string => {
  switch (errorType) {
    case '500':
      return 'Монитор с надписью 500 SERVER ERROR'
    case '404':
      return 'Монитор с надписью 404 ERROR'
  }
}

/** Общая рамка страниц ошибки: иллюстрация, заголовок, описание и действия.
 * @see Figma: страницы 404 и 500; фреймы указаны в README страниц. */
export function ErrorPage({ errorImage, title, description, errorType, actions }: ErrorPageProps) {
  return (
    <main className={styles.page}>
      <div className={styles.content}>
        <img
          className={styles.image}
          src={errorImage}
          alt={chooseAlt(errorType)}
          width={460}
          height={304}
        />
        <div className={styles.text}>
          <h1 className={styles.title}>{title}</h1>
          <p className={styles.description}>{description}</p>
        </div>
        {actions ? <div className={styles.actions}>{actions}</div> : null}
      </div>
    </main>
  )
}
