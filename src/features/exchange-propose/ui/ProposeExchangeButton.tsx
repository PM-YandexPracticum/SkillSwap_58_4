import ClockIcon from '@/shared/assets/icons/clock.svg?react'
import { Button } from '@/shared/ui/Button'

export interface ProposeExchangeButtonProps {
  /** Автор навыка, которому предлагаем обмен. Понадобится при подключении логики (P7-03) */
  toUserId: string
  /** Навык, на который предлагается обмен. Понадобится при подключении логики (P7-03) */
  skillId: string
  /** Обмен уже предложен: кнопка обведённая, неактивная, с часами и подписью «Обмен предложен» */
  isProposed?: boolean
  /** Нажатие на «Предложить обмен». У состояния «Обмен предложен» кнопка отключена и не вызывается */
  onClick?: () => void
}

/**
 * Кнопка «Предложить обмен» на странице навыка — два состояния.
 * В P3-09 это только вид: состояние приходит пропсами, обмен и уведомление не создаются.
 * Гость → вход с возвратом, создание обмена, toast, окно и красная точка на колокольчике подключит P7-03:
 * после «Готово» кнопка становится обведённой неактивной «🕓 Обмен предложен» (1:1919).
 * @see Figma: «Страница навыка» (1:1864), «Обмен предложен» (1:1919)
 */
export function ProposeExchangeButton({ isProposed = false, onClick }: ProposeExchangeButtonProps) {
  if (isProposed) {
    return (
      <Button variant="secondary" disabled>
        <ClockIcon width={20} height={20} aria-hidden="true" />
        Обмен предложен
      </Button>
    )
  }

  return <Button onClick={onClick}>Предложить обмен</Button>
}
