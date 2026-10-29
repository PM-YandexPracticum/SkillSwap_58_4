import type { ID, ISODateString } from '@/shared/types'

/**
 * Предложение обмена. По решению наставника обмен «номинальный»: второй стороны нет,
 * предложение только создаётся — статусов «принят / отклонён» не делаем.
 */
export interface Exchange {
  id: ID
  /** Кто предложил — текущий пользователь */
  fromUserId: ID
  /** Кому предложили */
  toUserId: ID
  /** Навык получателя */
  skillId: ID
  createdAt: ISODateString
}
