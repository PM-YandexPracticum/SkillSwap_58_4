import { createMockCollection, isISODateString, isRecord, isString, loadSeed } from '@/shared/api'
import { DATA_ERRORS } from '@/shared/config'
import type { Exchange } from '../model/types'

const isExchange = (value: unknown): value is Exchange =>
  isRecord(value) &&
  isString(value.id) &&
  isString(value.fromUserId) &&
  isString(value.toUserId) &&
  isString(value.skillId) &&
  isISODateString(value.createdAt)

/**
 * Хранилище предложенных обменов.
 * Единственное место, которое знает, откуда берутся данные. Переход на настоящую БД — меняется только этот файл.
 */
const exchanges = createMockCollection<Exchange>(
  'exchanges',
  loadSeed<Exchange>('exchanges', isExchange),
  { validate: isExchange },
)

// Проверку пары и запись выполняем вместе: два одновременных вызова не создадут дубль.
let creationQueue: Promise<unknown> = Promise.resolve()

/** Все предложенные обмены */
export function getExchanges(): Promise<Exchange[]> {
  return creationQueue.then(() => exchanges.getAll())
}

/** Сохранить предложение. Повторная пара fromUserId + toUserId запрещена, независимо от skillId. */
export function createExchange(exchange: Exchange): Promise<Exchange> {
  const input = { ...exchange }
  const result = creationQueue.then(async () => {
    const items = await exchanges.getAll()
    if (
      items.some((item) => item.fromUserId === input.fromUserId && item.toUserId === input.toUserId)
    ) {
      throw new Error(DATA_ERRORS.DUPLICATE_EXCHANGE)
    }
    return exchanges.create(input)
  })
  creationQueue = result.catch(() => undefined)
  return result
}
