import { createSlice } from '@reduxjs/toolkit'
import type { Notification } from './types'

export interface NotificationsState {
  items: Notification[]
}

const initialState: NotificationsState = {
  items: [],
}

/**
 * Уведомления текущего пользователя.
 * TODO: notificationAdded, allMarkedAsRead
 */
export const notificationsSlice = createSlice({
  name: 'notifications',
  initialState,
  reducers: {},
})

export const notificationsReducer = notificationsSlice.reducer
