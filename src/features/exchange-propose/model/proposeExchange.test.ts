import { proposeExchange } from './proposeExchange'

describe('proposeExchange', () => {
  it('подготавливает обмен со стабильным id и текст подтверждения', () => {
    const proposal = proposeExchange({
      fromUserId: 'u01',
      toUserId: 'u02',
      skillId: 's01',
      toUserName: 'Иван',
      createdAt: '2026-11-12T10:00:00.000Z',
    })

    expect(proposal).toEqual({
      exchange: {
        id: 'exchange-u01-u02-s01',
        fromUserId: 'u01',
        toUserId: 'u02',
        skillId: 's01',
        notificationPending: true,
        createdAt: '2026-11-12T10:00:00.000Z',
      },
      message: 'Вы предложили обмен Ивану',
    })
  })
})
