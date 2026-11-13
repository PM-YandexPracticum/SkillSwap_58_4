import { completeExchangeProposal, createExchange, getExchanges } from './exchangeApi'
import type { Exchange } from '../model/types'

const exchange: Exchange = {
  id: 'exchange-test',
  fromUserId: 'author-test',
  toUserId: 'recipient-test',
  skillId: 'skill-test',
  createdAt: '2026-01-15T10:00:00.000Z',
}

describe('exchangeApi', () => {
  it('сохраняет предложение и не меняет переданный объект', async () => {
    const input = Object.freeze({ ...exchange })
    await createExchange(input)
    expect(await getExchanges()).toContainEqual(exchange)
  })

  it('запрещает второй обмен тому же человеку даже на другой навык', async () => {
    await createExchange(exchange)
    await expect(
      createExchange({ ...exchange, id: 'duplicate', skillId: 'other-skill' }),
    ).rejects.toThrow('Вы уже предложили обмен этому пользователю')
  })

  it('при одновременных предложениях сохраняет только одно', async () => {
    const results = await Promise.allSettled([
      createExchange(exchange),
      createExchange({ ...exchange, id: 'duplicate' }),
    ])
    expect(results.map((result) => result.status).sort()).toEqual(['fulfilled', 'rejected'])
    expect(
      (await getExchanges()).filter((item) => item.fromUserId === exchange.fromUserId),
    ).toHaveLength(1)
  })

  it('после отказа разрешает предложение другой пары пользователей', async () => {
    await createExchange(exchange)
    await expect(createExchange({ ...exchange, id: 'duplicate' })).rejects.toThrow()
    await expect(
      createExchange({
        ...exchange,
        id: 'reverse',
        fromUserId: exchange.toUserId,
        toUserId: exchange.fromUserId,
      }),
    ).resolves.toMatchObject({ id: 'reverse' })
  })
  it('сохраняет завершение уведомления и повторяет его без изменения записи', async () => {
    await createExchange({ ...exchange, notificationPending: true })
    const completed = await completeExchangeProposal(exchange.id, exchange.fromUserId)
    expect(completed.notificationPending).toBe(false)
    expect(await getExchanges()).toContainEqual(completed)
    expect(await completeExchangeProposal(exchange.id, exchange.fromUserId)).toEqual(completed)
  })

  it('не разрешает завершить предложение другого владельца', async () => {
    await createExchange({ ...exchange, notificationPending: true })
    await expect(completeExchangeProposal(exchange.id, 'foreign')).rejects.toThrow()
    expect(
      (await getExchanges()).find((item) => item.id === exchange.id)?.notificationPending,
    ).toBe(true)
  })

  it('старые записи без признака незавершённости остаются завершёнными', async () => {
    await createExchange(exchange)
    expect(await completeExchangeProposal(exchange.id, exchange.fromUserId)).toEqual(exchange)
  })

  it('после перезагрузки модулей читает сохранённый обмен и запрещает повтор', async () => {
    await createExchange(exchange)
    vi.resetModules()
    const reloaded = await import('./exchangeApi')
    expect(await reloaded.getExchanges()).toContainEqual(exchange)
    await expect(reloaded.createExchange({ ...exchange, id: 'after-reload' })).rejects.toThrow(
      'Вы уже предложили обмен этому пользователю',
    )
  })
})

it('создаёт обмен за одно чтение коллекции вместо предварительного getAll', async () => {
  const read = vi.spyOn(Storage.prototype, 'getItem')
  try {
    await createExchange(exchange)
    expect(read.mock.calls.filter(([key]) => key === 'skillswap_db_exchanges')).toHaveLength(1)
  } finally {
    read.mockRestore()
  }
})
