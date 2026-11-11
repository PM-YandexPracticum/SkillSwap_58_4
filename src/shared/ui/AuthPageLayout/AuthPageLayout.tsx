import type { ReactNode } from 'react'
import styles from './AuthPageLayout.module.css'

export interface AuthPageLayoutProps {
  title: string
  /** Индикатор шагов. При его наличии название страницы остаётся доступно скринридеру */
  progress?: ReactNode
  illustration: ReactNode
  children: ReactNode
  /** Класс левой карточки для геометрии конкретного шага. */
  formClassName?: string
}

/**
 * Общая область main экранов входа и регистрации: заголовок, форма слева, иллюстрация справа.
 * Логотип и закрытие предоставляет внешний AuthLayout из app. Переходами компонент не управляет.
 * @see Figma: вход 1:2400, первый шаг регистрации 1:2548
 */
export function AuthPageLayout({
  title,
  progress,
  illustration,
  children,
  formClassName,
}: AuthPageLayoutProps) {
  return (
    <main className={styles.page}>
      <div className={styles.heading}>
        <h1 className={progress ? styles.visuallyHidden : styles.title}>{title}</h1>
        {progress}
      </div>
      <div className={styles.columns}>
        <div className={[styles.formPanel, formClassName].filter(Boolean).join(' ')}>
          {children}
        </div>
        {illustration}
      </div>
    </main>
  )
}
