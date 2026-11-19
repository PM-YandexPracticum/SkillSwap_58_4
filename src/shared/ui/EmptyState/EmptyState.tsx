import type { ReactNode } from 'react'
import { Button } from '@/shared/ui/Button'
import styles from './EmptyState.module.css'

export interface EmptyStateProps {
  /** Сообщение о пустом списке; заголовок раздела остаётся у родителя. */
  title: string
  /** Дополнительная подсказка, если нужна пользователю. */
  description?: string
  /** Необязательная декоративная иконка, скрытая от скринридера. */
  icon?: ReactNode
  /** Представление для панели уведомлений с её прежними отступами и цветом. */
  compact?: boolean
  /** Внешняя геометрия и фон задаются потребителем. */
  className?: string
  /** Действие выполняет родитель; внутри переиспользуется общий Button. */
  action?: {
    label: string
    onClick: () => void
  }
}

/**
 * Общая презентация пустого списка: сообщение, необязательное описание и действие.
 * Компонент не знает, почему список пуст и как его загрузить — это решает родитель.
 *
 * @see Figma: 1:2860 (каталог), 1:2190 (уведомления); отдельный пустой фрейм не нарисован.
 */
export function EmptyState({
  title,
  description,
  icon,
  compact,
  action,
  className,
}: EmptyStateProps) {
  const rootClassName = [styles.emptyState, compact && styles.compact, className]
    .filter(Boolean)
    .join(' ')

  return (
    <div className={rootClassName} role="status">
      {icon && (
        <div className={styles.icon} aria-hidden="true">
          {icon}
        </div>
      )}
      <p className={styles.title}>{title}</p>
      {description && <p className={styles.description}>{description}</p>}
      {action && (
        <Button variant="secondary" onClick={action.onClick}>
          {action.label}
        </Button>
      )}
    </div>
  )
}
