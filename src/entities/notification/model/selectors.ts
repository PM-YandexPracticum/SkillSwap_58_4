import { createSelector } from '@reduxjs/toolkit'

const selectItems = (state: RootState) => state.notifications.items
const selectUserId = (state: RootState) => state.session.session?.userId

/** Уведомления текущего пользователя. Гостю — пустой список; результат стабилен до смены данных/владельца. */
export const selectNotifications = createSelector([selectItems, selectUserId], (items, userId) =>
  userId ? items.filter((notification) => notification.userId === userId) : [],
)

/** Красная точка только для собственных непрочитанных уведомлений. */
export const selectHasUnread = createSelector([selectNotifications], (items) =>
  items.some((notification) => !notification.isRead),
)

/** Общий статус операций с уведомлениями: loading, пока есть незавершённые запросы. */
export const selectNotificationsStatus = (state: RootState) => state.notifications.status
/** Понятная пользователю ошибка группы операций или null. */
export const selectNotificationsError = (state: RootState) => state.notifications.error
/** Ошибка именно первоначальной загрузки (для кнопки «Повторить»); ошибки операций — в selectNotificationsError. */
export const selectNotificationsLoadError = (state: RootState) => state.notifications.loadError
