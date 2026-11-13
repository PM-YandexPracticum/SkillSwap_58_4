import { createLookup } from '@/shared/lib/createLookup'
import { createSelector } from '@reduxjs/toolkit'
import type { Exchange } from './types'
import type { ID } from '@/shared/types'

const selectItems = (state: RootState) => state.exchanges.items
const selectUserId = (state: RootState) => state.session?.session?.userId ?? null

/** Входящие и исходящие предложения вошедшего пользователя; гостю — пустой список. */
export const selectExchanges = createSelector([selectItems, selectUserId], (items, userId) =>
  userId ? items.filter((item) => item.fromUserId === userId || item.toUserId === userId) : [],
)

/** Индекс исходящих предложений перестраивается только при смене списка или владельца. */
const selectOutgoingLookup = createSelector([selectItems, selectUserId], (items, userId) =>
  createLookup(
    userId ? items.filter((item) => item.fromUserId === userId) : [],
    (item) => item.toUserId,
  ),
)

/** Исходящий обмен, включая незавершённую запись уведомления; поиск O(log n). */
export const selectOutgoingExchange = (state: RootState, otherUserId: ID): Exchange | undefined =>
  selectOutgoingLookup(state)(otherUserId)

/** Предлагал ли текущий пользователь обмен этому человеку (независимо от навыка). */
export const selectHasProposed = (state: RootState, otherUserId: ID): boolean =>
  !!selectOutgoingExchange(state, otherUserId)

/** Общий статус операций с обменами: loading, пока есть незавершённые запросы. */
export const selectExchangesStatus = (state: RootState) => state.exchanges.status
/** Понятная пользователю ошибка группы операций или null. */
export const selectExchangesError = (state: RootState) => state.exchanges.error
