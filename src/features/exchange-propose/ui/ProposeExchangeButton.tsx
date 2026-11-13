import ClockIcon from '@/shared/assets/icons/clock.svg?react'
import { Button } from '@/shared/ui/Button'

export interface ProposeExchangeButtonProps {
  /** Автор навыка, которому предлагаем обмен. */
  toUserId: string
  /** Навык, на который предлагается обмен. */
  skillId: string
  /** Обмен уже предложен: кнопка обведённая, неактивная, с часами и подписью «Обмен предложен» */
  isProposed?: boolean
  /** Временная блокировка на время сохранения обмена и уведомления. */
  disabled?: boolean
  /** Нажатие на «Предложить обмен». У состояния «Обмен предложен» кнопка отключена и не вызывается */
  onClick?: () => void
}

/**
 * Кнопка «Предложить обмен» на странице навыка — два состояния.
 * Сохранение обмена, уведомление, toast и окно подключены на странице навыка (P7-03).
 * Во время записи кнопка блокируется, после успешной записи становится обведённой
 * неактивной «🕓 Обмен предложен» (1:1919).
 * @see Figma: «Страница навыка» (1:1864), «Обмен предложен» (1:1919)
 */
export function ProposeExchangeButton({
  isProposed = false,
  disabled = false,
  onClick,
}: ProposeExchangeButtonProps) {
  if (isProposed) {
    return (
      <Button variant="secondary" disabled>
        <ClockIcon width={20} height={20} aria-hidden="true" />
        Обмен предложен
      </Button>
    )
  }

  return (
    <Button disabled={disabled} onClick={onClick}>
      Предложить обмен
    </Button>
  )
}
