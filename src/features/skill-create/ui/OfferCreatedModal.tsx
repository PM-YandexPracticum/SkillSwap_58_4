import DoneIcon from '@/shared/assets/icons/done.svg?react'
import { Button } from '@/shared/ui/Button'
import { Modal } from '@/shared/ui/Modal'

import styles from './OfferCreatedModal.module.css'

export interface OfferCreatedModalProps {
  isOpen: boolean
  /** «Готово», Esc и клик по фону */
  onClose: () => void
}

/**
 * Окно после регистрации: галочка, «Ваше предложение создано», «Теперь вы можете предложить обмен», «Готово».
 * После регистрации пользователь всегда попадает в каталог (ТЗ наставника, 2.6), окно показывается там (1:2950);
 * после «Готово» — каталог с шапкой вошедшего (1:2904).
 * Как показать: `navigate(ROUTES.HOME, { state: { offerCreated: true } })`, страница каталога видит флаг и открывает окно (P6-06).
 * Построено на `shared/ui/Modal`; содержимое задаёт отступы 62/60 px и иконку 100 px.
 * Геометрия 556 × 420 — по актуальному макету; согласована вместо прежних отступов 80/60 px из задачи.
 * @see Figma: 1:2950, 1:2904
 */
export function OfferCreatedModal({ isOpen, onClose }: OfferCreatedModalProps) {
  return (
    <Modal isOpen={isOpen} onClose={onClose} ariaLabel="Ваше предложение создано">
      <div className={styles.content}>
        <DoneIcon className={styles.icon} aria-hidden="true" />
        <div className={styles.body}>
          <div className={styles.text}>
            <h2 className={styles.title}>Ваше предложение создано</h2>
            <p className={styles.description}>Теперь вы можете предложить обмен</p>
          </div>
          <Button onClick={onClose}>Готово</Button>
        </div>
      </div>
    </Modal>
  )
}
