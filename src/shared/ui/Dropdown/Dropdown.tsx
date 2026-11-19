import { useEffect, useLayoutEffect, useRef } from 'react'

import { useClickOutside } from '@/shared/lib/hooks/useClickOutside'
import styles from './Dropdown.module.css'

// минимальный отступ поповера от края окна браузера
const EDGE_GAP = 36

export interface DropdownProps {
  /** Кнопка, под которой открывается поповер; открывает его сам родитель */
  trigger: React.ReactNode
  /** Открыт ли поповер — состояние хранит родитель */
  isOpen: boolean
  /** Вызывается по Esc и клику мимо */
  onClose: () => void
  /** Содержимое поповера — любое */
  children: React.ReactNode
  /** К какому краю кнопки прижать: `start` — к левому, `end` — к правому. По умолчанию `start` */
  align?: 'start' | 'end'
  /** Дополнительный класс для поповера (например, свои отступы) */
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
 * - по умолчанию под триггером, выровнен по его левому краю (для кнопки «Все навыки»);
 * - `align="end"` - по правому краю (для уведомлений и меню пользователя справа в шапке);
 * - если поповер не помещается в окно, он сдвигается так, чтобы до края окна
 *   оставалось `EDGE_GAP`, как в макете; положение пересчитывается и при resize.
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

  // клик мимо - только когда открыт
  useClickOutside(wrapperRef, onClose, isOpen)

  // esc - только когда открыт
  useEffect(() => {
    if (!isOpen) return

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose()
    }

    document.addEventListener('keydown', onKeyDown)
    return () => document.removeEventListener('keydown', onKeyDown)
  }, [isOpen, onClose])

  // сдвиг внутрь окна: стиль меняем прямо в DOM до отрисовки, без лишнего рендера
  useLayoutEffect(() => {
    const el = popoverRef.current
    if (!isOpen || !el) return

    const reposition = () => {
      // Замеряем исходное положение, чтобы сдвиги не накапливались.
      el.style.translate = ''
      const { left, right } = el.getBoundingClientRect()
      const shift = getEdgeShift(left, right, document.documentElement.clientWidth)
      el.style.translate = shift ? `${shift}px 0` : ''
    }
    reposition()
    window.addEventListener('resize', reposition)
    return () => window.removeEventListener('resize', reposition)
  }, [isOpen, align, children])

  return (
    <div ref={wrapperRef} className={styles.wrapper}>
      {trigger}

      {isOpen && (
        <div
          ref={popoverRef}
          className={[styles.popover, align === 'end' ? styles.alignEnd : '', className ?? '']
            .filter(Boolean)
            .join(' ')}
        >
          {children}
        </div>
      )}
    </div>
  )
}

/** На сколько пикселей сдвинуть поповер, чтобы до краёв окна оставалось не меньше `EDGE_GAP` */
function getEdgeShift(left: number, right: number, viewportWidth: number): number {
  const maxRight = viewportWidth - EDGE_GAP
  if (right > maxRight) return maxRight - right
  if (left < EDGE_GAP) return EDGE_GAP - left
  return 0
}
