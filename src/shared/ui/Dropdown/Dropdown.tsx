import { useEffect, useLayoutEffect, useRef, useState } from 'react'

import { useClickOutside } from '@/shared/lib/hooks/useClickOutside'
import styles from './Dropdown.module.css'

// минимальный отступ поповера от края окна браузера
const EDGE_GAP = 36

export interface DropdownProps {
  trigger: React.ReactNode
  isOpen: boolean
  onClose: () => void
  children: React.ReactNode
  align?: 'start' | 'end'
  className?: string
}

/**
 * Поповер, привязанный к триггеру: «Все навыки», уведомления, меню пользователя.
 *
 * Сам Dropdown не знает о содержимом - внутрь кладут что угодно
 * (меню, список уведомлений и т.п.).
 *
 * Закрытие:
 * - по Esc;
 * - по клику мимо (хук `useClickOutside`).
 *
 * Позиционирование:
 * - по умолчанию под триггером, выровнен по его левому краю (для правых кнопок шапки);
 * - `align="end"` - по правому краю (для кнопки "Все навыки");
 * - если поповер упирается в край вьюпорта, он прижимается к краю
 *   с отступом `EDGE_GAP`, а не обрезается.
 */
export function Dropdown({
  trigger,
  isOpen,
  onClose,
  children,
  align = 'start',
  className,
}: DropdownProps) {
  const wrapperRef = useRef<HTMLDivElement>(null)
  const popoverRef = useRef<HTMLDivElement>(null)
  const [edge, setEdge] = useState<'none' | 'left' | 'right'>('none')

  // клик мимо - только когда открыт
  useClickOutside(wrapperRef, onClose, isOpen)

  // esc - только когда открыт
  useEffect(() => {
    if (!isOpen) return

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        event.stopPropagation()
        onClose()
      }
    }

    document.addEventListener('keydown', onKeyDown)
    return () => document.removeEventListener('keydown', onKeyDown)
  }, [isOpen, onClose])

  // прижатие к краю вьюпорта
  useLayoutEffect(() => {
    if (!isOpen) {
      setEdge('none')
      return
    }
    const el = popoverRef.current
    if (!el) return

    // сбрасываем, чтобы замерить положение
    setEdge('none')

    const rect = el.getBoundingClientRect()
    const viewport = document.documentElement.clientWidth

    if (rect.right > viewport - EDGE_GAP) {
      setEdge('right')
    } else if (rect.left < EDGE_GAP) {
      setEdge('left')
    }
  }, [isOpen, align, children])

  const edgeClass = edge === 'right' ? styles.clampRight : edge === 'left' ? styles.clampLeft : ''

  return (
    <div ref={wrapperRef} className={styles.wrapper}>
      {trigger}

      {isOpen && (
        <div
          ref={popoverRef}
          role="dialog"
          aria-modal="false"
          className={[
            styles.popover,
            align === 'end' ? styles.alignEnd : '',
            edgeClass,
            className ?? '',
          ]
            .filter(Boolean)
            .join(' ')}
          style={
            edge === 'right'
              ? { right: EDGE_GAP }
              : edge === 'left'
                ? { left: EDGE_GAP }
                : undefined
          }
        >
          {children}
        </div>
      )}
    </div>
  )
}
