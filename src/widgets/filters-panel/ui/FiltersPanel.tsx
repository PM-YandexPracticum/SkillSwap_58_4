import { ModeFilter, SkillsFilter, GenderFilter, CityFilter, ResetFiltersButton } from '@/features/catalog-filter';
import type { Category } from '@/entities/category';
import styles from './FiltersPanel.module.css';

export interface FiltersPanelProps {
  className?: string;
  categories?: Category[];
  filtersCount?: number;
}

export function FiltersPanel({
  className,
  categories = [],
  filtersCount = 0 //
}: FiltersPanelProps) {


  const titleText = filtersCount > 0 ? `Фильтры (${filtersCount})` : 'Фильтры';

  return (
    <aside className={[styles.panel, className].filter(Boolean).join(' ')}>

      <div className={styles.header}>
        <h2 className={styles.title}>{titleText}</h2>
        <ResetFiltersButton onClick={() => console.log('Сброс фильтров')} />
      </div>

      <div className={styles.content}>
        <ModeFilter />
        <SkillsFilter categories={categories} />
        <GenderFilter />
        <CityFilter />
      </div>

    </aside>
  );
}
