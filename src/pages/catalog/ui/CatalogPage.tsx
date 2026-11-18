import { useEffect, useMemo, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { fetchExchanges } from '@/entities/exchange'
import {
  selectUsers,
  selectPopularUsers,
  selectNewUsers,
  selectRecommendedUsers,
} from '@/entities/user'
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
import { OfferCreatedModal } from '@/features/skill-create'

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
 * P5-06: «Рекомендуем» и результаты догружаются лентой; смена фильтров, поиска
 * или сортировки даёт новый мемоизированный список, и лента начинается сначала.
 * @see Figma: 1:2861, 1:2860, 1:2819
 */
export function CatalogPage() {
  const dispatch = useAppDispatch()
  const location = useLocation()
  const navigate = useNavigate()
  const [isOfferCreatedOpen, setIsOfferCreatedOpen] = useState(false)
  const users = useAppSelector(selectUsers)
  // fetchUsers один раз перемешивает store: это и есть случайный порядок «Рекомендуем».
  // applyFilters всегда сортирует по дате, поэтому без фильтров его результат не подходит.
  const recommendedUsers = useAppSelector(selectRecommendedUsers)
  const popularUsers = useAppSelector(selectPopularUsers)
  const newUsers = useAppSelector(selectNewUsers)

  const filtersCounter = useAppSelector(selectActiveFiltersCount)
  const filters = useAppSelector(selectCatalogFilter)
  const categories = useAppSelector(selectCategories)
  const cities = useAppSelector(selectCities)
  const skills = useAppSelector(selectSkills)
  const searchQuery = useAppSelector(selectSearchQuery)

  useEffect(() => {
    dispatch(loadCatalogExchanges)
  }, [dispatch])

  useEffect(() => {
    const state = location.state as { offerCreated?: boolean } | null
    if (state?.offerCreated !== true) return

    setIsOfferCreatedOpen(true)
    navigate(`${location.pathname}${location.search}${location.hash}`, {
      replace: true,
      state: null,
    })
  }, [location.hash, location.pathname, location.search, location.state, navigate])

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

  const results = isFiltered
    ? {
        filters: tags,
        sort: filters.sort,
        onRemoveFilter: handleRemoveFilter,
        onSortChange: handleSortChange,
      }
    : undefined

  return (
    <>
      <main className={styles.page} aria-labelledby="catalog-title">
        <h1 className={styles.srOnly} id="catalog-title">
          Каталог предложений
        </h1>
        <CatalogView
          users={isFiltered ? filteredUsers : recommendedUsers}
          popularUsers={popularUsers}
          newUsers={newUsers}
          results={results}
        />
      </main>
      <OfferCreatedModal isOpen={isOfferCreatedOpen} onClose={() => setIsOfferCreatedOpen(false)} />
    </>
  )
}
