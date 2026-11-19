import { createNotification } from '@/entities/notification/testing'
import { createUser } from '@/entities/user/testing'
import { buildNotificationsWithNames } from './buildNotificationsWithNames'

describe('buildNotificationsWithNames', () => {
  it.each([
    ['Иван', 'male', 'Ивану'],
    ['Мария', 'female', 'Марии'],
  ] as const)('использует общее склонение имени %s', (name, gender, expected) => {
    const user = createUser({ id: 'recipient', name, gender })
    const notification = createNotification({ toUserId: user.id })
    expect(buildNotificationsWithNames([notification], [user])).toEqual([
      { ...notification, userName: expected },
    ])
  })
  it('сохраняет уведомление, если адресат отсутствует', () => {
    const notification = createNotification({ toUserId: 'missing' })
    expect(buildNotificationsWithNames([notification], [])).toEqual([
      { ...notification, userName: 'пользователю' },
    ])
  })
  it('возвращает пустой список на пустом входе', () => {
    expect(buildNotificationsWithNames([], [])).toEqual([])
  })
})
