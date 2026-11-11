import { selectUsers } from '@/entities/user'
import { useAppSelector } from '@/shared/lib/store'
import { CatalogView, type CatalogViewProps } from './CatalogView'
import styles from './CatalogPage.module.css'

export interface CatalogPageProps {
  /** Готовый вид результатов. Плашки, список и сортировку подключает P5-05. */
  results?: CatalogViewProps['results']
}

/**
 * Главная страница P3-10: готовые карточки и секции, панель фильтров и единая область main.
 * Сортировка секций — P5-04, результаты — P5-05, выбор фильтров — P5-02, догрузка — P5-06.
 * @see Figma: 1:2861, 1:2860, 1:2819
 */
export function CatalogPage({ results }: CatalogPageProps) {
  const users = useAppSelector(selectUsers)

  return (
    <main className={styles.page} aria-labelledby="catalog-title">
      <h1 className={styles.srOnly} id="catalog-title">
        Каталог предложений
      </h1>
      <CatalogView users={users} results={results} />
    </main>
  )
}
