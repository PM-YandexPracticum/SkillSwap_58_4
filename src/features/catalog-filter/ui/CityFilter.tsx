import { useState } from 'react';
import { Checkbox } from '@/shared/ui/Checkbox';
import ChevronDownIcon from '@/shared/assets/icons/chevron-down.svg?react';
import ChevronUpIcon from '@/shared/assets/icons/chevron-up.svg?react';
import type { City } from '@/entities/city';
import styles from './CityFilter.module.css';


const CITIES_VISIBLE = 5;

export interface CityFilterProps {
  className?: string;
  cities: City[];
}

/**
 * Чекбоксы «Город» из справочника entities/city.
 */
export function CityFilter({ className, cities }: CityFilterProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  const [selectedCities, setSelectedCities] = useState<string[]>([]);

  const toggleCity = (id: string) => {
    setSelectedCities((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const visibleCities = isExpanded ? cities : cities.slice(0, CITIES_VISIBLE);
  const hasMore = cities.length > CITIES_VISIBLE;

  return (
    <div className={[styles.container, className].filter(Boolean).join(' ')}>
      <h3 className={styles.title}>Город</h3>

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
      </div>

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
  );
}
