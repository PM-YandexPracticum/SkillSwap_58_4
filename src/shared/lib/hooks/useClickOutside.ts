import type { RefObject } from 'react'

/**
 * Вызывает `handler`, когда пользователь кликает вне элемента `ref`.
 * Нужен для закрытия выпадашек: «Все навыки», уведомления, меню пользователя.
 * @param ref ссылка на DOM-элемент
 * @param handler колбэк закрытия
 */
export function useClickOutside(_ref: RefObject<HTMLElement>, _handler: () => void): void {
  // TODO: useEffect + document.addEventListener('mousedown', ...)
}
