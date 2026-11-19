import type { ReactNode } from 'react'
import type { PublicUser } from '@/entities/user'
import {
  ActiveFilters,
  resetFilters,
  selectActiveFiltersCount,
  SortToggle,
  type ActiveFilterTag,
  type SortOrder,
} from '@/features/catalog-filter'
import { CATALOG } from '@/shared/config'
import { useInfiniteScroll } from '@/shared/lib/hooks'
import { EmptyState } from '@/shared/ui/EmptyState'
import { FiltersPanel } from '@/widgets/filters-panel'
import { OfferCard } from '@/widgets/offer-card'
import { OffersSection } from '@/widgets/offers-section'
import { useAppDispatch, useAppSelector } from '@/shared/lib/store'
import styles from './CatalogView.module.css'

export interface CatalogViewProps {
  /**
   * С `results` — найденные карточки в порядке сортировки, без них — «Рекомендуем»
   * в случайном порядке store. Ссылка должна быть стабильной: смена списка начинает ленту сначала.
   */
  users: ReadonlyArray<PublicUser>
  /** Для «Популярного»: по убыванию лайков. */
  popularUsers: ReadonlyArray<PublicUser>
  /** Для «Нового»: от новых к старым по дате регистрации. */
  newUsers: ReadonlyArray<PublicUser>
  /** Отдельное состояние вёрстки. Вывод результатов фильтрации и поиска. */
  results?: {
    filters: ReadonlyArray<ActiveFilterTag>
    sort: SortOrder
    onRemoveFilter: (id: string) => void
    onSortChange: (value: SortOrder) => void
    /** Полный сброс поиска и фильтров из пустого результата. */
    onReset: () => void
  }
}

const renderCard = (user: PublicUser) => <OfferCard user={user} />

interface FeedSectionProps {
  title: string
  users: ReadonlyArray<PublicUser>
  headerAction?: ReactNode
}

/**
 * Лента по CATALOG.SCROLL_BATCH карточек.
 * При прокрутке к концу загружает следующую порцию.
 */
function FeedSection({ title, users, headerAction }: FeedSectionProps) {
  const { visibleItems, sentinelRef, isLoading, hasMore } = useInfiniteScroll(
    users,
    CATALOG.SCROLL_BATCH,
    CATALOG.SCROLL_DELAY_MS,
  )

  return (
    <OffersSection
      title={title}
      users={visibleItems}
      mode="infinite"
      renderItem={renderCard}
      headerAction={headerAction}
      isLoading={isLoading}
      hasMore={hasMore}
      sentinelRef={sentinelRef}
    />
  )
}

/**
 * Вёрстка каталога: панель слева, три секции либо отдельный вид результатов справа.
 * «Рекомендуем» и результаты — бесконечные ленты по 6 карточек (P5-06).
 * Пустые списки показывает EmptyState; стартовая загрузка и ошибка остаются в DataProvider.
 * @see Figma: 1:2861 (каталог), 1:2860 (результаты); пустые состояния — вне макета.
 */
export function CatalogView({ users, popularUsers, newUsers, results }: CatalogViewProps) {
  const dispatch = useAppDispatch()
  const filtersCount = useAppSelector(selectActiveFiltersCount)

  const handleResetFilters = (): void => {
    dispatch(resetFilters())
  }

  return (
    <div className={styles.layout}>
      <FiltersPanel filtersCount={filtersCount} onReset={handleResetFilters} />
      <div className={[styles.content, results && styles.results].filter(Boolean).join(' ')}>
        {results ? (
          <>
            <ActiveFilters items={results.filters} onRemove={results.onRemoveFilter} />
            <FeedSection
              key="results"
              title={`Подходящие предложения: ${users.length}`}
              users={users}
              headerAction={<SortToggle value={results.sort} onChange={results.onSortChange} />}
            />
            {!users.length && (
              <EmptyState
                title="Ничего не нашлось"
                description="Попробуйте изменить параметры поиска или сбросить фильтры"
                action={{
                  label: 'Сбросить поиск и фильтры',
                  onClick: results.onReset,
                }}
              />
            )}
          </>
        ) : users.length ? (
          <>
            <OffersSection
              title="Популярное"
              users={popularUsers}
              mode="expandable"
              renderItem={renderCard}
            />
            <OffersSection
              title="Новое"
              users={newUsers}
              mode="expandable"
              renderItem={renderCard}
            />
            <FeedSection key="recommended" title="Рекомендуем" users={users} />
          </>
        ) : (
          <EmptyState
            title="Предложения пока не добавлены"
            description="Загляните позже - здесь появятся новые обмены"
          />
        )}
      </div>
    </div>
  )
}
