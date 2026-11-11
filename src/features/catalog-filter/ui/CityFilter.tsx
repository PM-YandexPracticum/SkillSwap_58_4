import { useState } from 'react'
import { Checkbox } from '@/shared/ui/Checkbox'
import ChevronDownIcon from '@/shared/assets/icons/chevron-down.svg?react'
import ChevronUpIcon from '@/shared/assets/icons/chevron-up.svg?react'
import { CATALOG } from '@/shared/config'
import { selectCities } from '@/entities/city'
import { useAppSelector } from '@/shared/lib/store'
import styles from './CityFilter.module.css'

const CITIES_VISIBLE = CATALOG.CITIES_VISIBLE

export interface CityFilterProps {
  className?: string
}

export function CityFilter({ className }: CityFilterProps) {
  const [isExpanded, setIsExpanded] = useState(false)
  const [selectedCities, setSelectedCities] = useState<string[]>([])

  const cities = useAppSelector(selectCities)

  const toggleCity = (id: string) => {
    setSelectedCities((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id],
    )
  }

  const visibleCities = isExpanded ? cities : cities.slice(0, CITIES_VISIBLE)
  const hasMore = cities.length > CITIES_VISIBLE

  return (
    /* Оборачиваем в fieldset с ролью group */
    <fieldset
      className={[styles.container, className].filter(Boolean).join(' ')}
      role="group"
      aria-label="Город"
    >
      {/* Скрытый legend для тестов */}
      <legend className={styles.visuallyHidden}>Город</legend>

            <div className={styles.contentWrapper}>
        <h3 className={styles.title} aria-hidden="true">Город</h3>

        {/* Начало списка */}
        <div className={styles.list}>
          {visibleCities.map((city) => (
            <Checkbox
              key={city.id}
              label={city.name}
              checked={selectedCities.includes(city.id)}
              onChange={() => toggleCity(city.id)}
              className={styles.cityItem}
            />
          ))}

          {/* Кнопка "Все города" теперь внутри списка! */}
          {hasMore && (
            <button
              type="button"
              className={styles.toggleButton}
              onClick={() => setIsExpanded(!isExpanded)}
              aria-expanded={isExpanded}
            >
              {isExpanded ? (
                <>Свернуть <ChevronUpIcon className={styles.icon} /></>
              ) : (
                <>Все города <ChevronDownIcon className={styles.icon} /></>
              )}
            </button>
          )}
        </div>
        {/* Конец списка */}

      </div>
    </fieldset>
  )
}
