import type { Exchange } from '@/entities/exchange'

import { findSkillId } from './findSkillId'

/**
 * Локальный конструктор `Exchange` для теста.
 * В `entities/exchange` нет `testing.ts` — собираем объект вручную здесь.
 */

function makeExchange(overrides: Partial<Exchange> = {}): Exchange {
  return {
    id: 'e-test',
    fromUserId: 'u-from',
    toUserId: 'u-to',
    skillId: 's-test',
    createdAt: '2026-11-13T00:00:00.000Z',
    ...overrides,
  }
}

describe('findSkillId', () => {
  it('возвращает skillId обмена по его id', () => {
    const exchanges = [
      makeExchange({ id: 'e-1', skillId: 's-1' }),
      makeExchange({ id: 'e-2', skillId: 's-2' }),
    ]

    expect(findSkillId('e-2', exchanges)).toBe('s-2')
  })

  it('возвращает undefined, если обмена нет', () => {
    expect(findSkillId('e-нет', [])).toBeUndefined()
  })
})
