import { Tag, type TagColor } from '@/shared/ui/Tag'
import styles from './ActiveFilters.module.css'

/** Готовая подпись фильтра; id и подписи собирает buildActiveFilters на уровне страницы (P5-05). */
export interface ActiveFilterTag {
  id: string
  label: string
  color?: TagColor
}

export interface ActiveFiltersProps {
  items: ReadonlyArray<ActiveFilterTag>
  onRemove: (id: string) => void
  className?: string
}

/**
 * Ряд плашек над результатами: готовый Tag вызывает обработчик с уникальным id фильтра.
 * Сам компонент не читает store и не применяет фильтры.
 * @see Figma: каталог с фильтрами (1:2860), поиск (1:2819)
 */
export function ActiveFilters({ items, onRemove, className }: ActiveFiltersProps) {
  if (!items.length) return null
  return (
    <ul
      className={[styles.list, className].filter(Boolean).join(' ')}
      aria-label="Выбранные фильтры"
    >
      {items.map(({ id, label, color }) => (
        <li key={id}>
          <Tag variant="filter" label={label} color={color} onRemove={() => onRemove(id)} />
        </li>
      ))}
    </ul>
  )
}
