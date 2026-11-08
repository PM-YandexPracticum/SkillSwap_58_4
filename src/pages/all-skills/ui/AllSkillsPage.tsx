import { useId } from 'react'

import { CategoriesMenu } from '@/widgets/categories-menu'
import styles from './AllSkillsPage.module.css'

/**
 * Страница `/skills`: общий список категорий; Header и Footer предоставляет MainLayout.
 * Заголовок доступен скринридеру и скрыт визуально, поскольку в макете его нет.
 * @see Figma: «Все навыки» (1:3165)
 */
export function AllSkillsPage() {
  const titleId = useId()

  return (
    <main className={styles.page} aria-labelledby={titleId}>
      <h1 className={styles.title} id={titleId}>
        Все навыки
      </h1>
      <CategoriesMenu />
    </main>
  )
}
