import { useId, useState } from 'react'
import type { City } from '@/entities/city'
import { CATALOG } from '@/shared/config'
import ChevronDownIcon from '@/shared/assets/icons/chevron-down.svg?react'
import ChevronUpIcon from '@/shared/assets/icons/chevron-up.svg?react'
import { Checkbox } from '@/shared/ui/Checkbox'
import styles from './FilterGroup.module.css'

export interface CityFilterProps {
  /** Дополнительный CSS-класс */
  className?: string
  /** Справочник из selectCities; загрузку выполняет страница */
  cities: readonly City[]
}

/**
 * Города: первые CATALOG.CITIES_VISIBLE и раскрытие остальных.
 * До P5-02 галочки хранятся локально и не фильтруют каталог.
 * @see Figma: «Каталог — фильтры применены» (1:2860)
 */
export function CityFilter({ className, cities }: CityFilterProps) {
  const [isExpanded, setIsExpanded] = useState(false)
  const [selectedCities, setSelectedCities] = useState<string[]>([])
  const id = useId()
  const visibleCities = isExpanded ? cities : cities.slice(0, CATALOG.CITIES_VISIBLE)
  const hasMore = cities.length > CATALOG.CITIES_VISIBLE
  const Icon = isExpanded ? ChevronUpIcon : ChevronDownIcon

  return (
    <fieldset className={[styles.group, className].filter(Boolean).join(' ')}>
      <legend className={styles.title}>Город</legend>
      <div id={id} className={styles.list}>
        {visibleCities.map((city) => (
          <Checkbox
            key={city.id}
            label={city.name}
            checked={selectedCities.includes(city.id)}
            onChange={(checked) =>
              setSelectedCities((current) =>
                checked ? [...current, city.id] : current.filter((item) => item !== city.id),
              )
            }
            className={styles.item}
          />
        ))}
      </div>
      {hasMore && (
        <button
          type="button"
          className={[styles.toggleButton, styles.action].join(' ')}
          onClick={() => setIsExpanded((current) => !current)}
          aria-expanded={isExpanded}
          aria-controls={id}
          aria-label={isExpanded ? 'Свернуть города' : 'Все города'}
        >
          {isExpanded ? 'Свернуть' : 'Все города'}
          <Icon aria-hidden="true" />
        </button>
      )}
    </fieldset>
  )
}
