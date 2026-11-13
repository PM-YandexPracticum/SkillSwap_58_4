// src/pages/catalog/ui/CatalogView.tsx
import type { PublicUser } from '@/entities/user'
import {
  ActiveFilters,
  resetFilters,
  selectActiveFiltersCount,
  SortToggle,
  type ActiveFilterTag,
  type SortOrder,
} from '@/features/catalog-filter'
import { CATALOG, DATA_ERRORS } from '@/shared/config'
import { EmptyState } from '@/shared/ui/EmptyState'
import { Loader } from '@/shared/ui/Loader'
import { FiltersPanel } from '@/widgets/filters-panel'
import { OfferCard } from '@/widgets/offer-card'
import { OffersSection } from '@/widgets/offers-section'
import styles from './CatalogView.module.css'
import { useAppDispatch, useAppSelector } from '@/shared/lib/store'

export interface CatalogViewProps {
  users: ReadonlyArray<PublicUser>
  /** Для «Популярного»: по убыванию лайков. */
  popularUsers: ReadonlyArray<PublicUser>
  /** Для «Нового»: от новых к старым по дате регистрации. */
  newUsers: ReadonlyArray<PublicUser>
  /** Отдельное состояние вёрстки. Подбор данных и обработчики подключаются в P5-05. */
  results?: {
    filters: ReadonlyArray<ActiveFilterTag>
    sort: SortOrder
    onRemoveFilter: (id: string) => void
    onSortChange: (value: SortOrder) => void
  }
}

const renderCard = (user: PublicUser) => <OfferCard user={user} />

/**
 * Вёрстка каталога: панель слева, три секции либо отдельный вид результатов справа.
 * Порядок списков задаёт контейнер; раскрытие и сетку переиспользуем из OffersSection.
 * @see Figma: 1:2861, 1:2860, 1:2819
 */
export function CatalogView({ users, popularUsers, newUsers, results }: CatalogViewProps) {
  const dispatch = useAppDispatch()
  const filtersCount = useAppSelector(selectActiveFiltersCount)
  const usersStatus = useAppSelector((state) => state.users.status)

  const isLoading = usersStatus === 'loading'

  const handleResetFilters = (): void => {
    dispatch(resetFilters())
    /* сброс плашек выбранных фильтров будет в P5-05*/
  }

  /* Рендер секции Подходящие предложения (с использованием стора) будет реализован в P5-05 */
  return (
    <div className={styles.layout}>
      <FiltersPanel filtersCount={filtersCount} onReset={handleResetFilters} />
      <div className={[styles.content, results && styles.results].filter(Boolean).join(' ')}>
        {isLoading ? (
          <Loader className={styles.loader} />
        ) : usersStatus === 'failed' ? (
          <p role="alert">{DATA_ERRORS.LOAD_USERS}</p>
        ) : results ? (
          <>
            <ActiveFilters items={results.filters} onRemove={results.onRemoveFilter} />
            <OffersSection
              title={`Подходящие предложения: ${users.length}`}
              users={users}
              mode="infinite"
              renderItem={renderCard}
              headerAction={<SortToggle value={results.sort} onChange={results.onSortChange} />}
            />
            {!users.length && (
              <EmptyState
                title="Ничего не нашлось"
                description="Попробуйте изменить параметры поиска или сбросить фильтры"
                action={{ label: 'Сбросить фильтры', onClick: handleResetFilters }}
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
            <OffersSection
              title="Рекомендуем"
              users={users.slice(0, CATALOG.SCROLL_BATCH)}
              mode="infinite"
              renderItem={renderCard}
            />
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
