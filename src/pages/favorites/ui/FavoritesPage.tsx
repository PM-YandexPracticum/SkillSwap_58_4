import { useEffect, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'

import { loadExchangesIfNeeded } from '@/entities/exchange'
import { selectUsers } from '@/entities/user'
import type { PublicUser } from '@/entities/user'
import { selectSkills } from '@/entities/skill'
import {
  applyFilters,
  resetFilters,
  selectActiveFiltersCount,
  selectCatalogFilter,
} from '@/features/catalog-filter'
import { selectFavoriteIds } from '@/features/favorite-toggle'
import { queryCleared, selectSearchQuery } from '@/features/skill-search'
import { CATALOG, ROUTES } from '@/shared/config'
import { useInfiniteScroll } from '@/shared/lib/hooks'
import { useAppDispatch, useAppSelector } from '@/shared/lib/store'
import { EmptyState } from '@/shared/ui/EmptyState'
import { FiltersPanel } from '@/widgets/filters-panel'
import { OfferCard } from '@/widgets/offer-card'
import { OffersSection } from '@/widgets/offers-section'

import styles from './FavoritesPage.module.css'

const renderCard = (user: PublicUser) => <OfferCard user={user} />

/**
 * Избранное (`/favorites`, только для вошедших): пользователи из `likedUserIds` текущего пользователя,
 * FiltersPanel работает и здесь, лента с догрузкой по 6. Снятый лайк сразу убирает карточку.
 * @see Figma: «Избранное» (1:15855)
 */
export function FavoritesPage() {
  const navigate = useNavigate()
  const dispatch = useAppDispatch()

  const users = useAppSelector(selectUsers)
  const favoriteIds = useAppSelector(selectFavoriteIds)
  const skills = useAppSelector(selectSkills)
  const filters = useAppSelector(selectCatalogFilter)
  const searchQuery = useAppSelector(selectSearchQuery)
  const filtersCount = useAppSelector(selectActiveFiltersCount)

  const favoriteUsers = useMemo(
    () => users.filter((user) => favoriteIds.includes(user.id)),
    [users, favoriteIds],
  )

  useEffect(() => {
    void dispatch(loadExchangesIfNeeded())
  }, [dispatch])

  const handleResetFilters = () => {
    dispatch(resetFilters())
    dispatch(queryCleared())
  }

  const filteredFavoriteUsers = useMemo(
    () => applyFilters(favoriteUsers, skills, filters, searchQuery),
    [favoriteUsers, skills, filters, searchQuery],
  )

  const { visibleItems, sentinelRef, isLoading, hasMore } = useInfiniteScroll(
    filteredFavoriteUsers,
    CATALOG.SCROLL_BATCH,
    CATALOG.SCROLL_DELAY_MS,
  )

  const hasFavorites = favoriteUsers.length > 0

  return (
    <main className={styles.container}>
      <h1 className={styles.srOnly}>Избранное</h1>

      <FiltersPanel
        className={styles.filters}
        filtersCount={filtersCount}
        onReset={handleResetFilters}
      />

      {filteredFavoriteUsers.length > 0 ? (
        <OffersSection
          title="Избранное"
          users={visibleItems}
          isLoading={isLoading}
          hasMore={hasMore}
          sentinelRef={sentinelRef}
          renderItem={renderCard}
          mode="infinite"
        />
      ) : (
        <section role="region" aria-label="Избранное">
          <EmptyState
            title={
              hasFavorites
                ? 'По выбранным фильтрам ничего не найдено'
                : 'В избранном пока нет предложений'
            }
            action={{
              label: hasFavorites ? 'Сбросить поиск и фильтры' : 'Вернуться в каталог',
              onClick: hasFavorites ? handleResetFilters : () => navigate(ROUTES.HOME),
            }}
          />
        </section>
      )}
    </main>
  )
}
