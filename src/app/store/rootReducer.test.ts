import { createAppStore } from '@/app/store'
import {
  addExchange,
  fetchExchanges,
  selectExchanges,
  selectHasProposed,
} from '@/entities/exchange'
import {
  addNotification,
  fetchNotifications,
  clearAllNotifications,
  selectNotifications,
  selectHasUnread,
} from '@/entities/notification'
import { createNotification } from '@/entities/notification/testing'
import { startSession, endSession } from '@/entities/session'

const notification = createNotification({ userId: 'owner', toUserId: 'recipient' })
const exchange = {
  id: notification.exchangeId,
  fromUserId: notification.userId,
  toUserId: notification.toUserId,
  skillId: 'skill-test',
  createdAt: notification.createdAt,
}

describe('P4-07: сессия и сохранённые данные', () => {
  it('смена сессии во время записи не показывает данные прошлого пользователя', async () => {
    const store = createAppStore()
    store.dispatch(startSession(notification.userId))
    const pendingExchange = store.dispatch(addExchange(exchange))
    const pendingNotification = store.dispatch(addNotification(notification))
    store.dispatch(endSession())
    store.dispatch(startSession('another-owner'))
    await Promise.all([pendingExchange.unwrap(), pendingNotification.unwrap()])
    expect(selectExchanges(store.getState())).toEqual([])
    expect(selectNotifications(store.getState())).toEqual([])
    expect(selectHasUnread(store.getState())).toBe(false)
    await store.dispatch(clearAllNotifications()).unwrap()
    store.dispatch(endSession())
    store.dispatch(startSession(notification.userId))
    const reloaded = createAppStore()
    await Promise.all([
      reloaded.dispatch(fetchExchanges()).unwrap(),
      reloaded.dispatch(fetchNotifications()).unwrap(),
    ])
    expect(selectHasProposed(reloaded.getState(), exchange.toUserId)).toBe(true)
    expect(selectNotifications(reloaded.getState())).toEqual([notification])
    expect(selectHasUnread(reloaded.getState())).toBe(true)
  })
})
