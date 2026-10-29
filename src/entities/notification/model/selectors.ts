/** Все уведомления */
export const selectNotifications = (state: RootState) => state.notifications.items

/** Есть ли непрочитанные — красная точка на колокольчике */
export const selectHasUnread = (state: RootState) =>
  state.notifications.items.some((notification) => !notification.isRead)
