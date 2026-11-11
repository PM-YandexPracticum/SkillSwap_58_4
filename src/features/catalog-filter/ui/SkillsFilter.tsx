import { useState } from 'react';
import { Checkbox } from '@/shared/ui/Checkbox';
import ChevronDownIcon from '@/shared/assets/icons/chevron-down.svg?react';
import ChevronUpIcon from '@/shared/assets/icons/chevron-up.svg?react';
import type { Category } from '@/entities/category';
import type { ID } from '@/shared/types';
import styles from './SkillsFilter.module.css';

const CATEGORIES_VISIBLE = 6;

export interface SkillsFilterProps {
  className?: string;
  categories: Category[];
}

/**
 * Фильтр «Навыки» с раскрывающимися категориями.
 */
export function SkillsFilter({ className, categories }: SkillsFilterProps) {
  const [expandedIds, setExpandedIds] = useState<ID[]>([]);
  const [showAll, setShowAll] = useState(false);
  const [selectedSubcategories, setSelectedSubcategories] = useState<ID[]>([]);

  const toggleExpand = (id: ID) => {
    setExpandedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const toggleCategory = (subcategoryIds: ID[]) => {
    const isAllSelected = subcategoryIds.every((id) => selectedSubcategories.includes(id));
    if (isAllSelected) {
      setSelectedSubcategories((prev) => prev.filter((id) => !subcategoryIds.includes(id)));
    } else {
      setSelectedSubcategories((prev) => Array.from(new Set([...prev, ...subcategoryIds])));
    }
  };

  const toggleSubcategory = (id: ID) => {
    setSelectedSubcategories((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const visibleCategories = showAll ? categories : categories.slice(0, CATEGORIES_VISIBLE);
  const hasMore = categories.length > CATEGORIES_VISIBLE;

  return (
    <fieldset
      className={[styles.container, className].filter(Boolean).join(' ')}
      role="group"
      aria-label="Навыки"
    >
      <legend className={styles.visuallyHidden}>Навыки</legend>

      <div className={styles.contentWrapper}>
        <h3 className={styles.title} aria-hidden="true">Навыки</h3>

        <div className={styles.list}>
          {visibleCategories.map((category) => {
            const isExpanded = expandedIds.includes(category.id);
            const subcategoryIds = category.subcategories.map((sub) => sub.id);
            const hasSubcategories = subcategoryIds.length > 0;

            const isCategoryChecked =
              hasSubcategories &&
              subcategoryIds.every((id) => selectedSubcategories.includes(id));

            const isIndeterminate =
              hasSubcategories &&
              !isCategoryChecked &&
              subcategoryIds.some((id) => selectedSubcategories.includes(id));

            return (
              <div key={category.id} className={styles.categoryGroup}>
                <div className={styles.categoryHeader}>
                  <Checkbox
                    label={category.title}
                    checked={isCategoryChecked}
                    indeterminate={isIndeterminate}
                    onChange={() => toggleCategory(subcategoryIds)}
                    className={styles.skillItem}
                    disabled={!hasSubcategories}
                  />

                  {hasSubcategories && (
                    <button
                      type="button"
                      className={styles.toggleButton}
                      onClick={() => toggleExpand(category.id)}
                      aria-expanded={isExpanded}
                      aria-controls={`subcategories-${category.id}`}
                      aria-label={
                        isExpanded
                          ? `Свернуть категорию «${category.title}»`
                          : `Развернуть категорию «${category.title}»`
                      }
                    >
                      {isExpanded ? <ChevronUpIcon /> : <ChevronDownIcon />}
                    </button>
                  )}
                </div>

                {isExpanded && hasSubcategories && (
                  <div
                    className={styles.subcategories}
                    id={`subcategories-${category.id}`}
                  >
                    {category.subcategories.map((sub) => (
                      <Checkbox
                        key={sub.id}
                        label={sub.title}
                        checked={selectedSubcategories.includes(sub.id)}
                        onChange={() => toggleSubcategory(sub.id)}
                      />
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {hasMore && (
          <button
            type="button"
            className={styles.showAllButton}
            onClick={() => setShowAll(!showAll)}
            aria-expanded={showAll}
          >
            {showAll ? 'Свернуть категории' : 'Все категории'}{' '}
            <ChevronDownIcon className={styles.smallIcon} />
          </button>
        )}
      </div>
    </fieldset>
  );
}
