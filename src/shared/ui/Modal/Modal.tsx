import { useEffect, useRef, type ReactElement } from 'react'
import { createPortal } from 'react-dom'
import style from './Modal.module.css'

export interface ModalProps {
  /** Открыта ли модалка */
  isOpen: boolean
  /** Вызывается при закрытии: по Esc или клику на фон */
  onClose: () => void
  /** Содержимое окна. Ширину и вертикальные отступы задаёт контент, не модалка */
  children: React.ReactNode
  /** Заголовок для скринридера: что это за окно */
  ariaLabel?: string
}

// Селектор элементов, на которые можно перевести фокус через Tab
const FOCUSABLE_SELECTOR =
  'a[href], button:not([disabled]), input, select, textarea, [tabindex]:not([tabindex="-1"])'

/**
 * Модальное окно с затемнением фона. Закрывается по Esc и клику на фон.
 * Фокус остаётся внутри окна, после закрытия возвращается на элемент-триггер.
 * Рендер через portal.
 * @see Figma: 1:1799, 1:1977, 1:2950 — превью навыка, «Вы предложили обмен», «Ваше предложение создано»
 */
export function Modal({ children, onClose, isOpen, ariaLabel }: ModalProps): ReactElement | null {
  // DOM-узел окна модалки, живёт, пока модалка открыта
  const windowRef = useRef<HTMLDivElement>(null)
  // Запоминаем элемент, на котором был фокус до открытия — чтобы вернуть его при закрытии
  const previousFocusRef = useRef<HTMLElement | null>(null)

  useEffect(() => {
    if (!isOpen) return
    previousFocusRef.current = document.activeElement as HTMLElement
    // Переводим фокус на само окно модалки
    windowRef.current?.focus()

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose()
        return
      }
      if (e.key === 'Tab') {
        const focusable = Array.from(
          windowRef.current?.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR) ?? [],
        )
        // Если внутри окна нечего фокусировать — не даём Tab увести фокус на страницу
        if (focusable.length === 0) {
          e.preventDefault()
          return
        }
        const first = focusable[0]
        const last = focusable[focusable.length - 1]
        const active = document.activeElement
        // Tab с последнего элемента — возвращаем фокус на первый
        if (!e.shiftKey && active === last) {
          e.preventDefault()
          first.focus()
        }
        // Shift+Tab с первого элемента (или с самого окна) — на последний
        if (e.shiftKey && (active === first || active === windowRef.current)) {
          e.preventDefault()
          last.focus()
        }
      }
    }

    document.addEventListener('keydown', handleKeyDown)

    return () => {
      document.removeEventListener('keydown', handleKeyDown)
      // Возвращаем фокус на элемент, с которого открыли модалку
      previousFocusRef.current?.focus()
    }
  }, [isOpen, onClose])

  if (!isOpen) return null

  return createPortal(
    <div className={style.overlay} onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div
        className={style.window}
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
