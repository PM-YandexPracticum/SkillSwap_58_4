export interface NotificationItemProps {
  notification: import('../model/types').Notification
  /** Имя того, кому предложили обмен */
  userName: string
  onGo?: () => void
}

/**
 * Строка уведомления: иконка, «Вы предложили обмен Ивану», дата и кнопка «Перейти» — открывает карточку Ивана.
 * Прочитанное уведомление показывается без кнопки и не кликается.
 * @see Figma: «Каталог - пользователь нажал на иконку» (1:2328)
 */
export function NotificationItem(_props: NotificationItemProps) {
  // TODO: реализовать по макету
  return null
}
