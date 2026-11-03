import { createMockCollection, loadSeed } from '@/shared/api'
import type { Exchange } from '../model/types'

/**
 * Хранилище предложенных обменов.
 * Единственное место, которое знает, откуда берутся данные. Переход на настоящую БД — меняется только этот файл.
 */
const exchanges = createMockCollection<Exchange>('exchanges', loadSeed<Exchange>('exchanges'))

/** Все предложенные обмены */
export function getExchanges(): Promise<Exchange[]> {
  return exchanges.getAll()
}

/** Сохранить новое предложение обмена */
export function createExchange(exchange: Exchange): Promise<Exchange> {
  return exchanges.create(exchange)
}
