import { useEffect } from 'react'
import { fetchExchanges } from '@/entities/exchange'
import { selectUsers, selectPopularUsers, selectNewUsers } from '@/entities/user'
import { useAppDispatch, useAppSelector } from '@/shared/lib/store'
import { CatalogView, type CatalogViewProps } from './CatalogView'
import styles from './CatalogPage.module.css'

/** Только обмены: общие справочники загружает DataProvider. */
function loadCatalogExchanges(dispatch: AppDispatch, getState: () => RootState) {
  // Читаем актуальный store: второй эффект StrictMode уже увидит loading.
  if (getState().exchanges.status === 'idle') void dispatch(fetchExchanges())
}

export interface CatalogPageProps {
  /** Готовый вид результатов. Плашки, список и сортировку подключает P5-05. */
  results?: CatalogViewProps['results']
}

/**
 * Главная страница P3-10: готовые карточки и секции, панель фильтров и единая область main.
 * Готовые селекторы задают порядок «Популярного» по лайкам и «Нового» по дате регистрации.
 * DataProvider загружает общие данные; страница отдельно запрашивает обмены для бейджей карточек.
 * Результаты — P5-05, выбор фильтров — P5-02, догрузка — P5-06.
 * @see Figma: 1:2861, 1:2860, 1:2819
 */
export function CatalogPage({ results }: CatalogPageProps) {
  const dispatch = useAppDispatch()
  const users = useAppSelector(selectUsers)
  const popularUsers = useAppSelector(selectPopularUsers)
  const newUsers = useAppSelector(selectNewUsers)

  useEffect(() => {
    dispatch(loadCatalogExchanges)
  }, [dispatch])

  return (
    <main className={styles.page} aria-labelledby="catalog-title">
      <h1 className={styles.srOnly} id="catalog-title">
        Каталог предложений
      </h1>
      <CatalogView
        users={users}
        popularUsers={popularUsers}
        newUsers={newUsers}
        results={results}
      />
    </main>
  )
}
