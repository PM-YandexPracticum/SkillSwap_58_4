import { IconButton } from '../IconButton'
import Idea from '../../assets/icons/idea.svg?react'
import Cross from '../../assets/icons/cross.svg?react'
import styles from './Toast.module.css'

export interface ToastProps {
  /** Текст уведомления, например «Вы предложили обмен Ивану». */
  message: string
  /** Закрыть уведомление; время показа контролирует ToastProvider. */
  onClose: () => void
}

/**
 * Сообщение с иконкой и доступной кнопкой закрытия; объявление обеспечивает ToastProvider.
 * @see Figma: 1:2148 (1:1975, 1:1976)
 */
export function Toast({ message, onClose }: ToastProps) {
  return (
    <div className={styles.toast}>
      <Idea className={styles.toastIcon} aria-hidden="true" focusable="false" />
      <span className={styles.message}>{message}</span>
      <span className={styles.closeBtn}>
        <IconButton
          ariaLabel="Закрыть уведомление"
          onClick={onClose}
          icon={<Cross className={styles.toastIcon} aria-hidden="true" focusable="false" />}
        />
      </span>
    </div>
  )
}
