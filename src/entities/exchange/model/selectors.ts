import { createSelector } from '@reduxjs/toolkit'
import type { ID } from '@/shared/types'

const selectItems = (state: RootState) => state.exchanges.items
const selectUserId = (state: RootState) => state.session?.session?.userId ?? null

/** Входящие и исходящие предложения вошедшего пользователя; гостю — пустой список. */
export const selectExchanges = createSelector([selectItems, selectUserId], (items, userId) =>
  userId ? items.filter((item) => item.fromUserId === userId || item.toUserId === userId) : [],
)

/** Предлагал ли текущий пользователь обмен этому человеку (независимо от навыка). */
export const selectHasProposed = (state: RootState, otherUserId: ID): boolean => {
  const userId = selectUserId(state)
  return (
    !!userId &&
    state.exchanges.items.some(
      (item) => item.fromUserId === userId && item.toUserId === otherUserId,
    )
  )
}

/** Общий статус операций с обменами: loading, пока есть незавершённые запросы. */
export const selectExchangesStatus = (state: RootState) => state.exchanges.status
/** Понятная пользователю ошибка группы операций или null. */
export const selectExchangesError = (state: RootState) => state.exchanges.error
