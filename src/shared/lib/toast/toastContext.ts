import { createContext } from 'react'

export interface ToastItem {
  id: string
  message: string
}

export interface ToastContextValue {
  /** Показать тост из любого места приложения */
  showToast: (message: string) => void
  /** Удалить конкретный тост по id (крестик или таймер) */
  removeToast: (id: string) => void
}

/**
 * Контекст системы тостов.
 * По умолчанию undefined — хук useToast проверяет это и кидает понятную ошибку.
 */
export const ToastContext = createContext<ToastContextValue | undefined>(undefined)
