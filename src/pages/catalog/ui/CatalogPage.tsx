import { useEffect, useMemo } from 'react'
import { fetchExchanges } from '@/entities/exchange'
import { selectUsers, selectPopularUsers, selectNewUsers } from '@/entities/user'
import { useAppDispatch, useAppSelector } from '@/shared/lib/store'
import { CatalogView } from './CatalogView'
import styles from './CatalogPage.module.css'
import {
  applyFilters,
  removeFilter,
  selectActiveFiltersCount,
  selectCatalogFilter,
  setSort,
  SortOrder,
} from '@/features/catalog-filter'
import { selectCategories } from '@/entities/category'
import { selectCities } from '@/entities/city'
import { selectSkills } from '@/entities/skill'
import { selectSearchQuery } from '@/features/skill-search'
import { buildActiveFilters } from '../lib/buildActiveFilters'
import { parseFilterRemoval } from '../lib/parseFilterRemoval'

/** Только обмены: общие справочники загружает DataProvider. */
function loadCatalogExchanges(dispatch: AppDispatch, getState: () => RootState) {
  // Читаем актуальный store: второй эффект StrictMode уже увидит loading.
  if (getState().exchanges.status === 'idle') void dispatch(fetchExchanges())
}

/**
 * Главная страница P3-10: готовые карточки и секции, панель фильтров и единая область main.
 * Готовые селекторы задают порядок «Популярного» по лайкам и «Нового» по дате регистрации.
 * DataProvider загружает общие данные; страница отдельно запрашивает обмены для бейджей карточек.
 * Плашки, результаты и сортировка подключены к общему store в P5-05 через applyFilters.
 * Догрузка списков остаётся в P5-06.
 * @see Figma: 1:2861, 1:2860, 1:2819
 */
export function CatalogPage() {
  const dispatch = useAppDispatch()
  const users = useAppSelector(selectUsers)
  const popularUsers = useAppSelector(selectPopularUsers)
  const newUsers = useAppSelector(selectNewUsers)

  const filtersCounter = useAppSelector(selectActiveFiltersCount)
  const filters = useAppSelector(selectCatalogFilter)
  const categories = useAppSelector(selectCategories)
  const cities = useAppSelector(selectCities)
  const skills = useAppSelector(selectSkills)
  const searchQuery = useAppSelector(selectSearchQuery)
  const sort = useAppSelector(selectCatalogFilter).sort

  useEffect(() => {
    dispatch(loadCatalogExchanges)
  }, [dispatch])

  const tags = useMemo(
    () => buildActiveFilters(filters, categories, cities),
    [filters, categories, cities],
  )
  const filteredUsers = useMemo(
    () => applyFilters(users, skills, filters, searchQuery),
    [users, skills, filters, searchQuery],
  )

  const handleSortChange = (sortOrder: SortOrder): void => {
    dispatch(setSort(sortOrder))
  }

  const handleRemoveFilter = (id: string): void => {
    dispatch(removeFilter(parseFilterRemoval(id)))
  }

  const hasSearch = searchQuery.trim().length > 0
  const isFiltered = hasSearch || filtersCounter > 0

  const results = isFiltered ? {
    filters: tags,
    sort,
    onRemoveFilter: handleRemoveFilter,
    onSortChange: handleSortChange,
  } : undefined

  return (
    <main className={styles.page} aria-labelledby="catalog-title">
      <h1 className={styles.srOnly} id="catalog-title">
        Каталог предложений
      </h1>
      <CatalogView
        users={filteredUsers}
        popularUsers={popularUsers}
        newUsers={newUsers}
        results={results}
      />
    </main>
  )
}
