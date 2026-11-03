import { useCallback, useEffect, useRef, useState } from 'react'
import { Toast } from '../../shared/ui/Toast/Toast'
import { ToastContext } from '../../shared/lib/toast/toastContext'
import type { ToastItem } from '../../shared/lib/toast/toastContext'

/** Время жизни тоста в мс */
const TOAST_DURATION = 4000

/**
 * Провайдер тостов: хранит список
 * и удаляет тосты по крестику или автоматически через 4 секунды.
 * @see Figma 1:2148 (1:1975, 1:1976) — внешний вид тоста
 */
export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<ToastItem[]>([])
  const idCounter = useRef(0)

  /** Все активные таймеры — чтобы почистить при размонтировании */
  const timers = useRef<ReturnType<typeof setTimeout>[]>([])

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id))
  }, [])

  const showToast = useCallback(
    (message: string) => {
      idCounter.current += 1
      const id = `toast-${idCounter.current}`

      setToasts((prev) => [...prev, { id, message }])

      const timer = setTimeout(() => removeToast(id), TOAST_DURATION)
      timers.current.push(timer)
    },
    [removeToast],
  )

  // Чистим таймеры при размонтировании провайдера
  useEffect(() => {
    const pending = timers.current
    return () => {
      pending.forEach(clearTimeout)
    }
  }, [])

  return (
    <ToastContext.Provider value={{ showToast, removeToast }}>
      {children}

      <div>
        {toasts.map((toast) => (
          <Toast key={toast.id} message={toast.message} onClose={() => removeToast(toast.id)} />
        ))}
      </div>
    </ToastContext.Provider>
  )
}
