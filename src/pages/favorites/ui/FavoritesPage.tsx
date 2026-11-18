import { useMemo } from 'react'

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
import { selectSearchQuery } from '@/features/skill-search'
import { useAppDispatch, useAppSelector } from '@/shared/lib/store'
import { CATALOG } from '@/shared/config'
import { useInfiniteScroll } from '@/shared/lib/hooks'
import { FiltersPanel } from '@/widgets/filters-panel'
import { OfferCard } from '@/widgets/offer-card'
import { OffersSection } from '@/widgets/offers-section'

import styles from './FavoritesPage.module.css'

/**
 * Избранное (`/favorites`, только для вошедших): пользователи из `likedUserIds` текущего пользователя,
 * FiltersPanel работает и здесь, лента с догрузкой по 6. Снятый лайк сразу убирает карточку.
 * @see Figma: «Избранное» (1:15855)
 */

const renderCard = (user: PublicUser) => <OfferCard user={user} />

export function FavoritesPage() {
  const users = useAppSelector(selectUsers)
  const favoriteIds = useAppSelector(selectFavoriteIds)

  const favoriteUsers = useMemo(
    () => users.filter((user) => favoriteIds.includes(user.id)),
    [users, favoriteIds],
  )

  const skills = useAppSelector(selectSkills)
  const filters = useAppSelector(selectCatalogFilter)
  const searchQuery = useAppSelector(selectSearchQuery)
  const filtersCount = useAppSelector(selectActiveFiltersCount)

  const dispatch = useAppDispatch()

  const handleResetFilters = () => {
    dispatch(resetFilters())
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

  return (
    <main className={styles.favoriteСontainer}>
      <FiltersPanel
        className={styles.filters}
        filtersCount={filtersCount}
        onReset={handleResetFilters}
      />

      <OffersSection
        title="Избранное"
        users={visibleItems}
        isLoading={isLoading}
        hasMore={hasMore}
        sentinelRef={sentinelRef}
        renderItem={renderCard}
        mode="infinite"
      />
    </main>
  )
}
