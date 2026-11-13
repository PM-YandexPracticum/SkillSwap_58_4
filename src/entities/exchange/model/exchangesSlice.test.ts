import { createTestStore } from '@/app/test/createTestStore'
import { createExchange, getExchanges } from '../api/exchangeApi'
import * as exchangeApi from '../api/exchangeApi'
import {
  addExchange,
  completeExchangeProposal,
  fetchExchanges,
  exchangesReducer,
} from './exchangesSlice'
import { selectHasProposed, selectExchangesStatus, selectExchangesError } from './selectors'
import type { Exchange } from './types'

const exchange: Exchange = {
  id: 'test-exchange',
  fromUserId: 'test-owner',
  toUserId: 'test-recipient',
  skillId: 'test-skill',
  createdAt: '2026-01-15T10:00:00.000Z',
}
const signedInStore = () => {
  return createTestStore({ session: { session: { userId: exchange.fromUserId, token: 'test' } } })
}

describe('exchangesSlice', () => {
  it('загружает обмены из базы, отмечает loading и succeeded', async () => {
    const store = signedInStore()
    const loading = store.dispatch(fetchExchanges())
    expect(selectExchangesStatus(store.getState())).toBe('loading')
    await loading.unwrap()
    expect(store.getState().exchanges.items).toEqual(await getExchanges())
    expect(selectExchangesStatus(store.getState())).toBe('succeeded')
  })

  it('добавленный обмен остаётся после создания нового store', async () => {
    const before = signedInStore()
    await before.dispatch(addExchange(exchange)).unwrap()
    const after = createTestStore({
      session: { session: { userId: exchange.fromUserId, token: 'test' } },
    })
    await after.dispatch(fetchExchanges()).unwrap()
    expect(selectHasProposed(after.getState(), exchange.toUserId)).toBe(true)
  })

  it('проверяет дубль в базе, даже если список в store ещё не загружен', async () => {
    await createExchange(exchange)
    const store = signedInStore()
    await expect(
      store.dispatch(addExchange({ ...exchange, id: 'duplicate' })).unwrap(),
    ).rejects.toBe('Вы уже предложили обмен этому пользователю')
    expect(selectExchangesError(store.getState())).toBe(
      'Вы уже предложили обмен этому пользователю',
    )
    expect(
      (await getExchanges()).filter((item) => item.fromUserId === exchange.fromUserId),
    ).toHaveLength(1)
  })

  it.each([null, 'other-owner'])(
    'не записывает обмен от чужого имени при сессии %s',
    async (userId) => {
      const store = createTestStore({
        session: { session: userId ? { userId, token: 'test' } : null },
      })
      await expect(store.dispatch(addExchange(exchange)).unwrap()).rejects.toBeTruthy()
      expect((await getExchanges()).some((item) => item.id === exchange.id)).toBe(false)
    },
  )

  it('завершает запись уведомления в базе и store', async () => {
    const store = signedInStore()
    await store.dispatch(addExchange({ ...exchange, notificationPending: true })).unwrap()
    await store.dispatch(completeExchangeProposal(exchange.id)).unwrap()
    expect(store.getState().exchanges.items[0].notificationPending).toBe(false)
    expect(
      (await getExchanges()).find((item) => item.id === exchange.id)?.notificationPending,
    ).toBe(false)
    expect(selectExchangesStatus(store.getState())).toBe('succeeded')
  })

  it.each([null, 'other-owner'])('не завершает чужой обмен при сессии %s', async (userId) => {
    await createExchange({ ...exchange, notificationPending: true })
    const store = createTestStore({
      session: { session: userId ? { userId, token: 'test' } : null },
    })
    await expect(
      store.dispatch(completeExchangeProposal(exchange.id)).unwrap(),
    ).rejects.toBeTruthy()
    expect(
      (await getExchanges()).find((item) => item.id === exchange.id)?.notificationPending,
    ).toBe(true)
  })

  it('после ошибки загрузки сохраняет прежний список и статус failed', () => {
    const initial = {
      items: [exchange],
      status: 'loading' as const,
      pendingRequests: 1,
      error: null,
    }
    const next = exchangesReducer(initial, fetchExchanges.rejected(new Error('offline'), 'request'))
    expect(initial.items).toEqual([exchange])
    expect(next.items).toEqual([exchange])
    expect(next.status).toBe('failed')
    expect(next.error).toBeTruthy()
  })
  it('ошибку API преобразует в понятное сообщение и позволяет повторить загрузку', async () => {
    const read = vi
      .spyOn(exchangeApi, 'getExchanges')
      .mockRejectedValueOnce(new Error('internal trace'))
    try {
      const store = signedInStore()
      await expect(store.dispatch(fetchExchanges()).unwrap()).rejects.toBe(
        'Не удалось загрузить обмены. Попробуйте ещё раз',
      )
      await store.dispatch(fetchExchanges()).unwrap()
      expect(selectExchangesStatus(store.getState())).toBe('succeeded')
      expect(selectExchangesError(store.getState())).toBeNull()
    } finally {
      read.mockRestore()
    }
  })

  it('нехватка места не добавляет несохранённый обмен в store', async () => {
    const store = signedInStore()
    const setItem = vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {
      throw new DOMException('Quota', 'QuotaExceededError')
    })
    try {
      await expect(store.dispatch(addExchange(exchange)).unwrap()).rejects.toContain(
        'Не хватает места',
      )
      expect(store.getState().exchanges.items).toEqual([])
      expect(selectExchangesStatus(store.getState())).toBe('failed')
    } finally {
      setItem.mockRestore()
    }
  })
  it('сохраняет loading, пока параллельная операция ещё не закончилась', async () => {
    const store = signedInStore()
    let finish!: (value: typeof exchange) => void
    const write = vi.spyOn(exchangeApi, 'createExchange').mockImplementationOnce(
      () =>
        new Promise((resolve) => {
          finish = resolve
        }),
    )
    try {
      const pending = store.dispatch(addExchange(exchange))
      await store.dispatch(fetchExchanges()).unwrap()
      expect(store.getState().exchanges.status).toBe('loading')
      finish(exchange)
      await pending.unwrap()
      expect(store.getState().exchanges.status).toBe('succeeded')
    } finally {
      finish(exchange)
      write.mockRestore()
    }
  })
  it('ошибка параллельной операции не теряется после успешного завершения другой', async () => {
    const store = signedInStore()
    let finish!: (value: typeof exchange) => void
    const write = vi.spyOn(exchangeApi, 'createExchange').mockImplementationOnce(
      () =>
        new Promise((resolve) => {
          finish = resolve
        }),
    )
    const read = vi
      .spyOn(exchangeApi, 'getExchanges')
      .mockRejectedValueOnce(new Error('internal trace'))
    try {
      const pending = store.dispatch(addExchange(exchange))
      await store.dispatch(fetchExchanges())
      expect(store.getState().exchanges.status).toBe('loading')
      finish(exchange)
      await pending.unwrap()
      expect(store.getState().exchanges.status).toBe('failed')
      expect(store.getState().exchanges.error).toBeTruthy()
      expect(store.getState().exchanges.pendingRequests).toBe(0)
    } finally {
      finish(exchange)
      write.mockRestore()
      read.mockRestore()
    }
  })
})
