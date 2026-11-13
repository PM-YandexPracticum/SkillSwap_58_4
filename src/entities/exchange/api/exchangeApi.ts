import { createMockCollection, isISODateString, isRecord, isString, loadSeed } from '@/shared/api'
import { DATA_ERRORS } from '@/shared/config'
import type { Exchange } from '../model/types'

const isExchange = (value: unknown): value is Exchange =>
  isRecord(value) &&
  isString(value.id) &&
  isString(value.fromUserId) &&
  isString(value.toUserId) &&
  isString(value.skillId) &&
  isISODateString(value.createdAt) &&
  (value.notificationPending === undefined || typeof value.notificationPending === 'boolean')

/**
 * Хранилище предложенных обменов.
 * Единственное место, которое знает, откуда берутся данные. Переход на настоящую БД — меняется только этот файл.
 */
const exchanges = createMockCollection<Exchange>(
  'exchanges',
  loadSeed<Exchange>('exchanges', isExchange),
  {
    validate: isExchange,
    validateWrite: (exchange, items, operation) => {
      if (
        items.some(
          (item) =>
            (operation === 'create' || item.id !== exchange.id) &&
            item.fromUserId === exchange.fromUserId &&
            item.toUserId === exchange.toUserId,
        )
      ) {
        throw new Error(DATA_ERRORS.DUPLICATE_EXCHANGE)
      }
    },
  },
)

// Проверку пары и запись выполняем вместе: два одновременных вызова не создадут дубль.
let creationQueue: Promise<unknown> = Promise.resolve()
function enqueue<T>(operation: () => Promise<T>): Promise<T> {
  const result = creationQueue.then(operation)
  creationQueue = result.catch(() => undefined)
  return result
}

/** Все предложенные обмены */
export function getExchanges(): Promise<Exchange[]> {
  return creationQueue.then(() => exchanges.getAll())
}

/** Сохранить предложение. Повторная пара fromUserId + toUserId запрещена, независимо от skillId. */
export function createExchange(exchange: Exchange): Promise<Exchange> {
  const input = { ...exchange }
  return enqueue(() => exchanges.create(input))
}

/** Завершает запись уведомления только для предложения владельца. */
export function completeExchangeProposal(id: string, fromUserId: string): Promise<Exchange> {
  return enqueue(async () => {
    const exchange = await exchanges.getById(id)
    if (!exchange || exchange.fromUserId !== fromUserId) throw new Error(DATA_ERRORS.OWNER)
    if (!exchange.notificationPending) return exchange
    return exchanges.update(id, { notificationPending: false })
  })
}
