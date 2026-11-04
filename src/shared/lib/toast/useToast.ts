import { useContext } from 'react'
import { ToastContext } from './toastContext'

/**
 * Хук для показа тостов из любого компонента.
 *
 * @example
 * const { showToast } = useToast();
 * showToast('Вы предложили обмен Ивану');
 */
export function useToast() {
  const context = useContext(ToastContext)

  if (!context) {
    throw new Error('useToast должен вызываться внутри <ToastProvider>')
  }

  return context
}
