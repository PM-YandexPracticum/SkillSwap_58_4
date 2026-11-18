import { createAsyncThunk, createSlice, isAnyOf } from '@reduxjs/toolkit'
import { DATA_ERRORS } from '@/shared/config'
import type { LoadingStatus } from '@/shared/types'

import {
  clearNotifications,
  createNotification,
  ensureExchangeNotification as ensureSaved,
  getNotifications,
  markAllNotificationsRead,
} from '../api/notificationApi'
import type { Notification } from './types'

export interface NotificationsState {
  items: Notification[]
  status: LoadingStatus
  pendingRequests: number
  error: string | null
  /**
   * Ошибка именно первоначальной загрузки (`fetchNotifications`).
   * Нужна, чтобы окно уведомлений показывало «Повторить» только для неё,
   * а ошибки «Прочитать все» / «Очистить» — отдельным баннером без повтора.
   */
  loadError: string | null
}
const initialState: NotificationsState = {
  items: [],
  status: 'idle',
  pendingRequests: 0,
  error: null,
  loadError: null,
}
type ThunkConfig = { state: RootState; rejectValue: string }

// В UI не передаём технические исключения; нехватку места объясняет общий слой хранения.
const saveError = (error: unknown, fallback: string) =>
  error instanceof Error && error.message === DATA_ERRORS.STORAGE_FULL ? error.message : fallback

/** Загрузка сохранённых уведомлений. Отбор по сессии — в selectNotifications. */
export const fetchNotifications = createAsyncThunk<Notification[], void, { rejectValue: string }>(
  'notifications/fetch',
  async (_, { rejectWithValue }) => {
    try {
      return await getNotifications()
    } catch {
      return rejectWithValue(DATA_ERRORS.LOAD_NOTIFICATIONS)
    }
  },
)

/** Сохранить уведомление владельца текущей сессии; UI получает запись только после успешного сохранения. */
export const addNotification = createAsyncThunk<Notification, Notification, ThunkConfig>(
  'notifications/add',
  async (notification, { getState, rejectWithValue }) => {
    const userId = getState().session.session?.userId
    if (!userId) return rejectWithValue(DATA_ERRORS.SIGN_IN)
    if (notification.userId !== userId) return rejectWithValue(DATA_ERRORS.OWNER)
    try {
      return await createNotification(notification)
    } catch (error) {
      return rejectWithValue(saveError(error, DATA_ERRORS.SAVE_NOTIFICATION))
    }
  },
)

/** Одна атомарная операция для повтора предложения без повторной загрузки всех уведомлений. */
export const ensureExchangeNotification = createAsyncThunk<Notification, Notification, ThunkConfig>(
  'notifications/ensureExchange',
  async (notification, { getState, rejectWithValue }) => {
    const userId = getState().session.session?.userId
    if (!userId) return rejectWithValue(DATA_ERRORS.SIGN_IN)
    if (notification.userId !== userId) return rejectWithValue(DATA_ERRORS.OWNER)
    try {
      return await ensureSaved(notification)
    } catch (error) {
      return rejectWithValue(saveError(error, DATA_ERRORS.SAVE_NOTIFICATION))
    }
  },
)

/** Прочитать новые уведомления текущего пользователя. Чужие записи не затрагиваются. */
export const markAllRead = createAsyncThunk<Notification[], void, ThunkConfig>(
  'notifications/markAllRead',
  async (_, { getState, rejectWithValue }) => {
    const userId = getState().session.session?.userId
    if (!userId) return rejectWithValue(DATA_ERRORS.SIGN_IN)
    try {
      return await markAllNotificationsRead(userId)
    } catch (error) {
      return rejectWithValue(saveError(error, DATA_ERRORS.READ_NOTIFICATIONS))
    }
  },
  { condition: (_, { getState }) => getState().notifications.pendingRequests === 0 },
)

/** Удалить новые и просмотренные уведомления только владельца текущей сессии. */
export const clearAllNotifications = createAsyncThunk<string[], void, ThunkConfig>(
  'notifications/clearAll',
  async (_, { getState, rejectWithValue }) => {
    const userId = getState().session.session?.userId
    if (!userId) return rejectWithValue(DATA_ERRORS.SIGN_IN)
    try {
      return await clearNotifications(userId)
    } catch (error) {
      return rejectWithValue(saveError(error, DATA_ERRORS.CLEAR_NOTIFICATIONS))
    }
  },
  { condition: (_, { getState }) => getState().notifications.pendingRequests === 0 },
)

/** Сохранённые уведомления. Видимость по владельцу — в селекторах, запись — только через API. */
export const notificationsSlice = createSlice({
  name: 'notifications',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchNotifications.fulfilled, (state, action) => {
        state.items = action.payload
      })
      .addCase(markAllRead.fulfilled, (state, action) => {
        // Обновлённые записи могут ещё отсутствовать в store, если загрузка при старте не закончилась.
        const ids = new Set(action.payload.map((item) => item.id))
        state.items = [...state.items.filter((item) => !ids.has(item.id)), ...action.payload]
      })
      .addCase(clearAllNotifications.fulfilled, (state, action) => {
        state.items = state.items.filter((item) => !action.payload.includes(item.id))
      })
      .addMatcher(
        isAnyOf(addNotification.fulfilled, ensureExchangeNotification.fulfilled),
        (state, action) => {
          state.items = [
            ...state.items.filter((item) => item.id !== action.payload.id),
            action.payload,
          ]
        },
      )
      .addMatcher(
        isAnyOf(
          fetchNotifications.pending,
          addNotification.pending,
          ensureExchangeNotification.pending,
          markAllRead.pending,
          clearAllNotifications.pending,
        ),
        (state, action) => {
          // Любая операция начинается с чистой ошибкой, как и раньше.
          if (state.pendingRequests === 0) state.error = null
          // Новый запуск загрузки сбрасывает старую ошибку загрузки —
          // иначе кнопка «Повторить» висела бы даже после успешной загрузки.
          if (fetchNotifications.pending.match(action)) state.loadError = null
          state.pendingRequests += 1
          state.status = 'loading'
        },
      )
      .addMatcher(
        isAnyOf(
          fetchNotifications.fulfilled,
          addNotification.fulfilled,
          ensureExchangeNotification.fulfilled,
          markAllRead.fulfilled,
          clearAllNotifications.fulfilled,
        ),
        (state) => {
          state.pendingRequests = Math.max(0, state.pendingRequests - 1)
          state.status =
            state.pendingRequests > 0 ? 'loading' : state.error ? 'failed' : 'succeeded'
        },
      )
      .addMatcher(
        isAnyOf(
          fetchNotifications.rejected,
          addNotification.rejected,
          ensureExchangeNotification.rejected,
          markAllRead.rejected,
          clearAllNotifications.rejected,
        ),
        (state, action) => {
          state.pendingRequests = Math.max(0, state.pendingRequests - 1)
          state.status = state.pendingRequests > 0 ? 'loading' : 'failed'
          const message = action.payload ?? DATA_ERRORS.LOAD_NOTIFICATIONS
          state.error = message
          // Ошибку загрузки дублируем в loadError — панель по ней покажет «Повторить».
          // Ошибки операций остаются только в error.
          if (fetchNotifications.rejected.match(action)) state.loadError = message
        },
      )
  },
})
export const notificationsReducer = notificationsSlice.reducer
