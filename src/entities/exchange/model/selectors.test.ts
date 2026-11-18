import { selectExchanges, selectHasProposed, selectOutgoingExchange } from './selectors'
import type { Exchange } from './types'

const items: Exchange[] = [
  {
    id: 'out',
    fromUserId: 'current',
    toUserId: 'recipient',
    skillId: 's-test',
    createdAt: '2026-01-15T10:00:00.000Z',
  },
  {
    id: 'in',
    fromUserId: 'sender',
    toUserId: 'current',
    skillId: 's-test',
    createdAt: '2026-01-15T10:00:00.000Z',
  },
  {
    id: 'foreign',
    fromUserId: 'stranger',
    toUserId: 'other',
    skillId: 's-test',
    createdAt: '2026-01-15T10:00:00.000Z',
  },
]
const setup = () => {
  return {
    exchanges: { items, status: 'succeeded', pendingRequests: 0, error: null },
    session: { session: { userId: 'current', token: 'test' } },
  } as RootState
}

describe('exchange selectors', () => {
  it('возвращает только входящие и исходящие обмены владельца', () => {
    const state = setup()
    expect(selectExchanges(state)).toEqual(items.slice(0, 2))
  })
  it('возвращает тот же массив без смены данных или сессии', () => {
    const state = setup()
    expect(selectExchanges(state)).toBe(selectExchanges(state))
  })
  it('учитывает направление: входящее предложение не считается предложением от владельца', () => {
    const state = setup()
    expect(selectHasProposed(state, 'recipient')).toBe(true)
    expect(selectHasProposed(state, 'sender')).toBe(false)
    expect(selectHasProposed(state, 'unknown')).toBe(false)
  })
  it('возвращает исходящую запись для повтора незавершённого уведомления', () => {
    const pending = { ...items[0], notificationPending: true }
    const state = setup()
    state.exchanges.items = [pending, items[1]]
    expect(selectOutgoingExchange(state, 'recipient')).toBe(pending)
    expect(selectOutgoingExchange(state, 'sender')).toBeUndefined()
    expect(selectHasProposed(state, 'recipient')).toBe(false)
  })

  it('после выхода не показывает обмены и бейдж предложенного обмена', () => {
    const state = { ...setup(), session: { session: null } } as RootState
    expect(selectExchanges(state)).toEqual([])
    expect(selectHasProposed(state, 'recipient')).toBe(false)
  })
})
