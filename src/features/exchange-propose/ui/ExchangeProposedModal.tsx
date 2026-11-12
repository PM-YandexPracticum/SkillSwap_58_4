import NotificationIcon from '@/shared/assets/icons/notification.svg?react'
import { Button } from '@/shared/ui/Button'
import { Modal } from '@/shared/ui/Modal'

import styles from './ExchangeProposedModal.module.css'

export interface ExchangeProposedModalProps {
  isOpen: boolean
  /** Закрытие по Esc или клику по фону */
  onClose: () => void
  /** Подтверждение кнопкой «Готово»; если не передано, используется onClose. */
  onConfirm?: () => void
}

/**
 * Окно после «Предложить обмен»: колокольчик, «Вы предложили обмен»,
 * «Теперь дождитесь подтверждения. Вам придёт уведомление», кнопка «Готово» во всю ширину.
 * Построено на `shared/ui/Modal`; отступы 80 px сверху/снизу и 60 px по бокам задаёт содержимое.
 * Между колокольчиком и блоком с текстом 52 px.
 * @see Figma: «Страница навыка» с модалкой (1:1977)
 */
export function ExchangeProposedModal({
  isOpen,
  onClose,
  onConfirm = onClose,
}: ExchangeProposedModalProps) {
  return (
    <Modal isOpen={isOpen} onClose={onClose} ariaLabel="Вы предложили обмен">
      <div className={styles.content}>
        <NotificationIcon className={styles.icon} aria-hidden="true" />
        <div className={styles.body}>
          <div className={styles.text}>
            <h2 className={styles.title}>Вы предложили обмен</h2>
            <p className={styles.description}>
              Теперь дождитесь подтверждения. Вам придёт уведомление
            </p>
          </div>
          <Button onClick={onConfirm}>Готово</Button>
        </div>
      </div>
    </Modal>
  )
}
