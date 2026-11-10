import type { PublicUser } from '@/entities/user'
import {
  ActiveFilters,
  SortToggle,
  type ActiveFilterTag,
  type SortOrder,
} from '@/features/catalog-filter'
import { CATALOG } from '@/shared/config'
import { FiltersPanel } from '@/widgets/filters-panel'
import { OfferCard } from '@/widgets/offer-card'
import { OffersSection } from '@/widgets/offers-section'
import styles from './CatalogView.module.css'

export interface CatalogViewProps {
  users: ReadonlyArray<PublicUser>
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
 * Данные передаются готовыми; сортировку, применение фильтров и догрузку добавляет фаза 5.
 * @see Figma: 1:2861, 1:2860, 1:2819
 */
export function CatalogView({ users, results }: CatalogViewProps) {
  return (
    <div className={styles.layout}>
      <FiltersPanel filtersCount={results?.filters.length} />
      <div className={[styles.content, results && styles.results].filter(Boolean).join(' ')}>
        {results ? (
          <>
            <ActiveFilters items={results.filters} onRemove={results.onRemoveFilter} />
            <OffersSection
              title={`Подходящие предложения: ${users.length}`}
              users={users}
              mode="infinite"
              renderItem={renderCard}
              headerAction={<SortToggle value={results.sort} onChange={results.onSortChange} />}
            />
            {!users.length && <p role="status">Ничего не нашлось</p>}
          </>
        ) : users.length ? (
          <>
            <OffersSection
              title="Популярное"
              users={users}
              mode="expandable"
              renderItem={renderCard}
            />
            <OffersSection title="Новое" users={users} mode="expandable" renderItem={renderCard} />
            <OffersSection
              title="Рекомендуем"
              users={users.slice(0, CATALOG.SCROLL_BATCH)}
              mode="infinite"
              renderItem={renderCard}
            />
          </>
        ) : (
          <p role="status">Предложения пока не добавлены</p>
        )}
      </div>
    </div>
  )
}
