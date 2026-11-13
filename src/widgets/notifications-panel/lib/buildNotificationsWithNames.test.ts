import { createNotification } from '@/entities/notification/testing'
import { createUser } from '@/entities/user/testing'

import { buildNotificationsWithNames } from './buildNotificationsWithNames'

describe('buildNotificationsWithNames', () => {
  const me = createUser({ id: 'u01' })
  const ivan = createUser({ id: 'u02', name: 'Иван', gender: 'male' })
  const maria = createUser({ id: 'u03', name: 'Мария', gender: 'female' })
  const stranger = createUser({ id: 'u99', name: 'Пётр', gender: 'male' })
  const users = [me, ivan, maria, stranger]

  it.each([
    ['чужое не показываем', [{ userId: 'u99', toUserId: 'u02' }], []],
    ['своё показываем', [{ userId: 'u01', toUserId: 'u02' }], ['u01']],
    [
      'смешанный вход — только своё',
      [
        { userId: 'u01', toUserId: 'u02' },
        { userId: 'u99', toUserId: 'u02' },
        { userId: 'u01', toUserId: 'u03' },
      ],
      ['u01', 'u01'],
    ],
  ] as const)('фильтр по владельцу: %s', (_label, raw, expectedOwners) => {
    const notifications = raw.map((overrides) => createNotification(overrides))
    const result = buildNotificationsWithNames(notifications, users, 'u01')

    expect(result.map((notification) => notification.userId)).toEqual(expectedOwners)
  })

  it.each([
    ['male → «Ивану»', ivan, 'Ивану'],
    ['female → «Марии»', maria, 'Марии'],
  ] as const)(
    'склоняет имя адресата в дательном падеже — %s',
    (_label, recipient, expectedName) => {
      const notification = createNotification({ userId: 'u01', toUserId: recipient.id })

      const result = buildNotificationsWithNames([notification], users, 'u01')

      expect(result[0]).toEqual({ ...notification, userName: expectedName })
    },
  )

  it('отбрасывает уведомление, если адресат не найден', () => {
    const result = buildNotificationsWithNames(
      [
        createNotification({ userId: 'u01', toUserId: 'u-нет' }),
        createNotification({ userId: 'u01', toUserId: ivan.id }),
      ],
      users,
      'u01',
    )

    expect(result).toHaveLength(1)
    expect(result[0].userName).toBe('Ивану')
  })

  it('возвращает пустой массив на пустом входе', () => {
    expect(buildNotificationsWithNames([], users, 'u01')).toEqual([])
  })
})
