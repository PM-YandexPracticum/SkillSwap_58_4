import { beforeEach, describe, expect, it } from 'vitest'

import { resetMockDb } from '@/shared/api'

import { DATA_ERRORS } from '@/shared/config'
import { createUser as userFixture } from '../testing'

import { getUsers, updateUser, createUser } from './userApi'

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

describe('уникальность email при записи пользователей', () => {
  it('принимает собственный email и отклоняет email другого пользователя при обновлении', async () => {
    const [first, second] = await getUsers()
    await expect(
      updateUser(first.id, { email: ` ${first.email.toUpperCase()} ` }),
    ).resolves.toMatchObject({ id: first.id })
    await expect(
      updateUser(first.id, { email: ` ${second.email.toUpperCase()} ` }),
    ).rejects.toThrow(DATA_ERRORS.DUPLICATE_EMAIL)
    expect(
      (await getUsers())
        .find((user) => user.id === first.id)
        ?.email.trim()
        .toLowerCase(),
    ).toBe(first.email.trim().toLowerCase())
  })

  it('проверяет create и update в одной очереди и продолжает работать после отказа', async () => {
    const [existing] = await getUsers()
    const email = 'concurrent@example.com'
    const results = await Promise.allSettled([
      updateUser(existing.id, { email }),
      createUser(userFixture({ id: 'new', email: email.toUpperCase() })),
    ])
    expect(results.map((result) => result.status)).toEqual(['fulfilled', 'rejected'])
    expect((await getUsers()).filter((user) => user.email.toLowerCase() === email)).toHaveLength(1)
    await expect(
      createUser(userFixture({ id: 'retry', email: 'another@example.com' })),
    ).resolves.toMatchObject({ id: 'retry' })
  })
})
