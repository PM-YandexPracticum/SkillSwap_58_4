import { useEffect } from 'react'
import { fetchCategories, selectCategoriesStatus } from '@/entities/category'
import { fetchCities, selectCitiesStatus } from '@/entities/city'
import { fetchSkills, selectSkillsStatus } from '@/entities/skill'
import { fetchUsers, selectUsers, selectUsersStatus } from '@/entities/user'
import { useAppDispatch, useAppSelector } from '@/shared/lib/store'
import type { LoadingStatus } from '@/shared/types'
import { Button } from '@/shared/ui/Button'
import { Loader } from '@/shared/ui/Loader'
import { CatalogView, type CatalogViewProps } from './CatalogView'
import styles from './CatalogPage.module.css'

/**
 * Временный запуск готовых thunks до общей загрузки P4-04.
 *
 * TODO(P4-04): удалить эту функцию и вызовы `loadCatalogData` из `useEffect` и retry-кнопки.
 * Их заменит `DataProvider` на уровне приложения: он один раз загрузит пользователей, навыки,
 * категории и города, а страница будет только читать селекторы и отдавать `CatalogView`.
 * Сейчас загрузка остаётся здесь, потому что P3-10 должна открываться напрямую до появления
 * общего провайдера. Свежий `getState()` не допускает повторного запуска при StrictMode.
 */
function loadCatalogData(retry = false) {
  return (dispatch: AppDispatch, getState: () => RootState) => {
    const state = getState()
    const shouldLoad = (status: LoadingStatus) =>
      status === 'idle' || (retry && status === 'failed')
    if (shouldLoad(state.users.status)) void dispatch(fetchUsers())
    if (shouldLoad(state.skills.status)) void dispatch(fetchSkills())
    if (shouldLoad(state.categories.status)) void dispatch(fetchCategories())
    if (shouldLoad(state.cities.status)) void dispatch(fetchCities())
  }
}

export interface CatalogPageProps {
  /** Готовый вид результатов. Применение фильтров и поиск подключаются в P5-05. */
  results?: CatalogViewProps['results']
}

/**
 * Главная страница P3-10: готовые карточки и секции, панель фильтров и единая область main.
 * До P4-04 запускает существующие thunks для пустого store; показывает загрузку, ошибку и повтор.
 * Сортировка секций — P5-04, результаты — P5-05, выбор фильтров — P5-02, догрузка — P5-06.
 * @see Figma: 1:2861, 1:2860, 1:2819
 */
export function CatalogPage({ results }: CatalogPageProps) {
  const dispatch = useAppDispatch()
  const users = useAppSelector(selectUsers)
  const statuses = [
    useAppSelector(selectUsersStatus),
    useAppSelector(selectSkillsStatus),
    useAppSelector(selectCategoriesStatus),
    useAppSelector(selectCitiesStatus),
  ]
  const failed = statuses.includes('failed')
  const loading = statuses.includes('idle') || statuses.includes('loading')

  // TODO(P4-04): убрать локальный effect вместе с loadCatalogData после подключения DataProvider.
  useEffect(() => {
    dispatch(loadCatalogData())
  }, [dispatch])

  return (
    <main className={styles.page} aria-labelledby="catalog-title">
      <h1 className={styles.srOnly} id="catalog-title">
        Каталог предложений
      </h1>
      {loading ? (
        <Loader />
      ) : failed ? (
        <div className={styles.feedback}>
          <p role="alert">Не удалось загрузить каталог</p>
          {/* TODO(P4-04): состояние ошибки и повтор будет отдавать общий DataProvider. */}
          <Button variant="secondary" onClick={() => dispatch(loadCatalogData(true))}>
            Попробовать снова
          </Button>
        </div>
      ) : (
        <CatalogView users={users} results={results} />
      )}
    </main>
  )
}
