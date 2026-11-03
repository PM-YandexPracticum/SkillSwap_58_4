import { useEffect, useRef, type MouseEvent, type ReactElement, type ReactNode } from 'react'
import { createPortal } from 'react-dom'

import styles from './Modal.module.css'

export interface ModalProps {
  /** Открыта ли модалка */
  isOpen: boolean
  /** Вызывается при закрытии: по Esc или клику на фон */
  onClose: () => void
  /** Содержимое окна вместе с внутренними отступами: в макете они у каждого окна свои */
  children: ReactNode
  /** Название окна для скринридера, например «Вы предложили обмен» */
  ariaLabel: string
}

// Элементы, на которые можно перевести фокус через Tab; отключённые пропускаем
const FOCUSABLE_SELECTOR = [
  'a[href]',
  'button:not([disabled])',
  'input:not([disabled])',
  'select:not([disabled])',
  'textarea:not([disabled])',
  '[tabindex]:not([tabindex="-1"])',
].join(', ')

/**
 * Модальное окно с затемнением фона: только обёртка — фон, белое окно и скругление.
 * Заголовок, текст, кнопки и внутренние отступы передаёт конкретное окно через `children`.
 * Закрывается по Esc и клику на фон. Фокус остаётся внутри окна, после закрытия возвращается на элемент, с которого открыли.
 * Пока окно открыто, страница под ним не прокручивается; высокое окно прокручивается вместе с фоном.
 * Рендер через portal.
 * @see Figma: 1:1799, 1:1977, 1:2950 — превью навыка, «Вы предложили обмен», «Ваше предложение создано»
 */
export function Modal({ children, onClose, isOpen, ariaLabel }: ModalProps): ReactElement | null {
  // DOM-узел окна модалки, живёт, пока модалка открыта
  const windowRef = useRef<HTMLDivElement>(null)
  // Последняя версия onClose: родитель часто передаёт новую функцию на каждой перерисовке,
  // а эффект ниже должен запускаться только при открытии и закрытии — иначе фокус «прыгает»
  const onCloseRef = useRef(onClose)
  onCloseRef.current = onClose
  // Нажатие мыши началось на фоне — только тогда клик по фону закрывает окно (а не конец выделения текста)
  const pressedOnOverlayRef = useRef(false)

  useEffect(() => {
    if (!isOpen) return
    // Запоминаем элемент, на котором был фокус до открытия — чтобы вернуть его при закрытии
    const previousFocus = document.activeElement as HTMLElement | null
    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    // Переводим фокус на само окно модалки
    windowRef.current?.focus()

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onCloseRef.current()
        return
      }
      if (event.key !== 'Tab') return

      const focusable = Array.from(
        windowRef.current?.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR) ?? [],
      )
      // Если внутри окна нечего фокусировать — не даём Tab увести фокус на страницу
      if (focusable.length === 0) {
        event.preventDefault()
        return
      }
      const first = focusable[0]
      const last = focusable[focusable.length - 1]
      const active = document.activeElement
      // Tab с последнего элемента — возвращаем фокус на первый
      if (!event.shiftKey && active === last) {
        event.preventDefault()
        first.focus()
      }
      // Shift+Tab с первого элемента (или с самого окна) — на последний
      if (event.shiftKey && (active === first || active === windowRef.current)) {
        event.preventDefault()
        last.focus()
      }
    }

    document.addEventListener('keydown', handleKeyDown)

    return () => {
      document.removeEventListener('keydown', handleKeyDown)
      document.body.style.overflow = previousOverflow
      // Возвращаем фокус на элемент, с которого открыли модалку
      previousFocus?.focus()
    }
  }, [isOpen])

  if (!isOpen) return null

  const handleOverlayMouseDown = (event: MouseEvent<HTMLDivElement>) => {
    pressedOnOverlayRef.current = event.target === event.currentTarget
  }

  const handleOverlayClick = (event: MouseEvent<HTMLDivElement>) => {
    if (pressedOnOverlayRef.current && event.target === event.currentTarget) onCloseRef.current()
    pressedOnOverlayRef.current = false
  }

  return createPortal(
    <div
      className={styles.overlay}
      onMouseDown={handleOverlayMouseDown}
      onClick={handleOverlayClick}
    >
      <div
        className={styles.window}
        ref={windowRef}
        role="dialog"
        aria-modal="true"
        aria-label={ariaLabel}
        tabIndex={-1}
      >
        {children}
      </div>
    </div>,
    document.body,
  )
}
