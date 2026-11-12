import { useId } from 'react'

import {
  CategoryIcon,
  selectCategories,
  selectCategoriesStatus,
} from '@/entities/category'
import { useAppSelector } from '@/shared/lib/store'
import { Loader } from '@/shared/ui/Loader'
import styles from './CategoriesList.module.css'

// Порядок колонок задан макетом, порядок категорий внутри — справочником.
const LEFT_COLUMN_IDS = new Set(['business', 'languages', 'home'])

export interface CategoriesListProps {
  /** Дополнительный CSS-класс */
  className?: string
}

/**
 * Общий статичный список для меню Header и страницы `/skills`: категории и подкатегории не кликаются.
 * Стартовую загрузку и восстановление после ошибки выполняет `DataProvider`, список читает
 * данные селекторами.
 * @see Figma: «Все навыки» (1:3165)
 */
export function CategoriesList({ className }: CategoriesListProps) {
  const categories = useAppSelector(selectCategories)
  const status = useAppSelector(selectCategoriesStatus)
  const listId = useId()

  if (status === 'idle' || status === 'loading') return <Loader className={className} />
  if (status === 'failed') {
    return (
      <div className={[styles.feedback, className].filter(Boolean).join(' ')}>
        <p role="alert">Не удалось загрузить категории</p>
      </div>
    )
  }
  if (!categories.length)
    return (
      <p className={className} role="status">
        Категории пока не добавлены
      </p>
    )

  const columns = [
    categories.filter((category) => LEFT_COLUMN_IDS.has(category.id)),
    categories.filter((category) => !LEFT_COLUMN_IDS.has(category.id)),
  ]

  return (
    <div className={[styles.columns, className].filter(Boolean).join(' ')}>
      {columns.map((column, index) => (
        <div className={styles.column} key={index}>
          {column.map((category) => (
            <section className={styles.category} key={category.id}>
              <CategoryIcon icon={category.icon} color={category.id} />
              <div className={styles.content}>
                <h2 className={styles.title} id={`${listId}-${category.id}`}>
                  {category.title}
                </h2>
                <ul className={styles.subcategories} aria-labelledby={`${listId}-${category.id}`}>
                  {category.subcategories.map((subcategory) => (
                    <li key={subcategory.id}>{subcategory.title}</li>
                  ))}
                </ul>
              </div>
            </section>
          ))}
        </div>
      ))}
    </div>
  )
}
