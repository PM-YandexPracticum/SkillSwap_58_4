import { selectOutgoingExchange } from './selectors'
import type { Exchange } from './types'

const exchange: Exchange = {
  id: 'e',
  fromUserId: 'owner',
  toUserId: 'recipient',
  skillId: 's',
  createdAt: '2026-01-01T00:00:00.000Z',
}
const stateWith = (items: Exchange[], userId = 'owner') =>
  ({
    exchanges: { items },
    session: { session: { userId } },
  }) as RootState

describe('индекс исходящих обменов', () => {
  it('не перечитывает записи на каждой карточке до смены списка', () => {
    const recipient = vi.fn(() => exchange.toUserId)
    const items = [
      {
        ...exchange,
        get toUserId() {
          return recipient()
        },
      },
    ]
    const state = stateWith(items)
    expect(selectOutgoingExchange(state, 'recipient')).toBe(items[0])
    recipient.mockClear()
    for (let i = 0; i < 100; i++) selectOutgoingExchange(state, String(i))
    expect(recipient).not.toHaveBeenCalled()
  })

  it('обновляет индекс после добавления, изменения, удаления и смены владельца', () => {
    expect(selectOutgoingExchange(stateWith([]), 'recipient')).toBeUndefined()
    expect(selectOutgoingExchange(stateWith([exchange]), 'recipient')).toBe(exchange)
    const completed = { ...exchange, notificationPending: false }
    expect(selectOutgoingExchange(stateWith([completed]), 'recipient')).toBe(completed)
    expect(selectOutgoingExchange(stateWith([]), 'recipient')).toBeUndefined()
    expect(selectOutgoingExchange(stateWith([exchange], 'other'), 'recipient')).toBeUndefined()
  })
})
