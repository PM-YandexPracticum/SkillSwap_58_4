export interface ModalProps {
  isOpen: boolean
  onClose: () => void
  children: React.ReactNode
}

/**
 * Модальное окно с затемнением фона («Ваше предложение создано», превью навыка). Закрывается по Esc и клику на фон. Рендер через portal.
 */
export function Modal(_props: ModalProps) {
  // TODO: реализовать по макету
  return null
}
