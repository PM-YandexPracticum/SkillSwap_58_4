import React from 'react'
import styles from './EmptyState.module.css'

export interface EmptyStateProps {
  title: string
  description?: string
  icon?: React.ReactNode
  compact?: boolean
  action?: {
    label: string
    onClick: () => void
  }
}

export const EmptyState = ({ title, description, icon, compact, action }: EmptyStateProps) => {
  const rootClassName = [styles.emptyState, compact && styles.compact].filter(Boolean).join(' ')

  return (
    <div className={rootClassName} role="status">
      {icon && <div className={styles.icon}>{icon}</div>}
      <h3 className={styles.title}>{title}</h3>
      {description && <p className={styles.description}>{description}</p>}
      {action && (
        <button className={styles.button} type="button" onClick={action.onClick}>
          {action.label}
        </button>
      )}
    </div>
  )
}
