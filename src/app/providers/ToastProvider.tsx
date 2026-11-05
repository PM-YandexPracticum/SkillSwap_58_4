import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import type { ReactNode } from 'react'
import { createPortal } from 'react-dom'
import { TOAST_DURATION } from '@/shared/config'
import { Toast } from '@/shared/ui/Toast'
import { ToastContext } from '@/shared/lib/toast'
import type { ToastItem } from '@/shared/lib/toast'
import styles from './ToastProvider.module.css'

export interface ToastProviderProps {
  /** Содержимое приложения, которому доступен useToast. */
  children: ReactNode
}

/**
 * Показывает уведомления в левом нижнем углу, закрывает по кнопке или через четыре секунды.
 * @see Figma: 1:2148 (1:1975, 1:1976)
 */
export function ToastProvider({ children }: ToastProviderProps) {
  const [toasts, setToasts] = useState<ToastItem[]>([])
  const idCounter = useRef(0)
  const timers = useRef(new Map<string, ReturnType<typeof setTimeout>>())

  const removeToast = useCallback((id: string) => {
    clearTimeout(timers.current.get(id))
    timers.current.delete(id)
    setToasts((prev) => prev.filter((toast) => toast.id !== id))
  }, [])

  const showToast = useCallback((message: string) => {
    idCounter.current += 1
    const id = `toast-${idCounter.current}`
    setToasts((prev) => [...prev, { id, message }])
  }, [])

  useEffect(() => {
    toasts.forEach(({ id }) => {
      if (!timers.current.has(id)) {
        timers.current.set(
          id,
          setTimeout(() => removeToast(id), TOAST_DURATION),
        )
      }
    })
  }, [toasts, removeToast])

  useEffect(() => {
    const pending = timers.current
    return () => {
      pending.forEach(clearTimeout)
      pending.clear()
    }
  }, [])

  const context = useMemo(() => ({ showToast, removeToast }), [showToast, removeToast])

  return (
    <ToastContext.Provider value={context}>
      {children}
      {createPortal(
        <div
          className={styles.notifications}
          role="log"
          aria-label="Уведомления"
          aria-live="polite"
          aria-relevant="additions"
        >
          {toasts.map((toast) => (
            <Toast key={toast.id} message={toast.message} onClose={() => removeToast(toast.id)} />
          ))}
        </div>,
        document.body,
      )}
    </ToastContext.Provider>
  )
}
