import { ModeFilter } from '@/features/catalog-filter/ui/ModeFilter';
import { SkillsFilter } from '@/features/catalog-filter/ui/SkillsFilter';
import { GenderFilter } from '@/features/catalog-filter/ui/GenderFilter';
import { CityFilter } from '@/features/catalog-filter/ui/CityFilter';
import { ResetFiltersButton } from '@/features/catalog-filter/ui/ResetFiltersButton';
import type { Category } from '@/entities/category';
import type { City } from '@/entities/city';
import styles from './FiltersPanel.module.css';

export interface FiltersPanelProps {
  className?: string;
  categories?: Category[];
  cities?: City[];
}

/**
 * Левая колонка «Фильтры (N) / Сбросить»: ModeFilter, SkillsFilter, GenderFilter, CityFilter.
 * @see Figma: «Каталог - фильтры применены» (1:2860)
 */
export function FiltersPanel({
  className,
  categories = [],
  cities = []
}: FiltersPanelProps) {
  return (
    <aside className={[styles.panel, className].filter(Boolean).join(' ')}>

      {/* Шапка с заголовком и кнопкой сброса */}
      <div className={styles.header}>
        <h2 className={styles.title}>Фильтры</h2>
        <ResetFiltersButton onClick={() => console.log('Сброс фильтров')} />
      </div>

      {/* Основной контент */}
      <div className={styles.content}>
        <ModeFilter />
        <SkillsFilter categories={categories} />
        <GenderFilter />
        <CityFilter cities={cities} />
      </div>

    </aside>
  );
}
