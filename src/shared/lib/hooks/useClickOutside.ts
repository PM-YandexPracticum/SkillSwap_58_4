import { useEffect, type RefObject } from 'react'

/**
 * Вызывает `handler`, когда пользователь кликает вне элемента `ref`.
 *
 * Используется для закрытия поповеров (Dropdown) по клику мимо.
 * Закрытие по Esc - ответственность потребителя (см. Dropdown),
 * т.к. не всегда нужно блокировать Escape глобально.
 *
 * @param ref - ссылка на элемент, клики внутри которого игнорируются
 * @param handler - колбэк, вызываемый при клике вне элемента
 * @param enabled - выключатель (например, когда поповер закрыт — не вешаем слушатель)
 */
export function useClickOutside<T extends HTMLElement>(
  ref: RefObject<T | null>,
  handler: (event: MouseEvent | TouchEvent) => void,
  enabled = true,
) {
  useEffect(() => {
    if (!enabled) return

    const listener = (event: MouseEvent | TouchEvent) => {
      const el = ref.current
      const target = event.target as Node | null

      // Клик внутри элемента или по его потомку - игнорируем.
      if (!el || !target || el.contains(target)) return

      handler(event)
    }

    document.addEventListener('mousedown', listener)
    document.addEventListener('touchstart', listener)

    return () => {
      document.removeEventListener('mousedown', listener)
      document.removeEventListener('touchstart', listener)
    }
  }, [ref, handler, enabled])
}
