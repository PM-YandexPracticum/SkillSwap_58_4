import { Button } from '@/shared/ui/Button'

import styles from './MarkAllReadButton.module.css'

export interface MarkAllReadButtonProps {
  /** Обработчик «Прочитать все»: в приложении его передаёт MainLayout, в story — заглушка. */
  onClick?: () => void
  disabled?: boolean
}

/**
 * Кнопка «Прочитать все»: переводит новые уведомления в просмотренные.
 * Компонент не знает о Redux и вызывает переданный обработчик.
 *
 * В макете 1:2148 — зелёный текст (#508826), Medium, без фона.
 * У shared/ui/Button такого варианта нет: ghost даёт серый цвет и вес 400.
 * Обёртка в span — чтобы не менять общий Button.
 *
 * @see Figma: 1:2239 (открытое окно), 1:2190 (окно), 1:2148 (экран)
 */
export function MarkAllReadButton({ onClick, disabled }: MarkAllReadButtonProps) {
  return (
    <span className={styles.wrapper}>
      <Button variant="ghost" onClick={onClick} disabled={disabled}>
        Прочитать все
      </Button>
    </span>
  )
}
