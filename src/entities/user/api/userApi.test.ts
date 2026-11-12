import { beforeEach, describe, expect, it } from 'vitest'

import { resetMockDb } from '@/shared/api'

import { getUsers, updateUser } from './userApi'

describe('userApi', () => {
  beforeEach(() => {
    localStorage.clear()
    resetMockDb()
  })

  it('не теряет валидные изменения после отклонённого обновления', async () => {
    const [user] = await getUsers()

    await updateUser(user.id, { name: 'Проверочное имя' })

    await expect(updateUser(user.id, { likesCount: -1 })).rejects.toThrow(
      'Неверная структура записи',
    )

    const savedUser = (await getUsers()).find((item) => item.id === user.id)
    expect(savedUser?.name).toBe('Проверочное имя')
    expect(savedUser?.likesCount).toBe(user.likesCount)
  })
})
