import { beforeEach, describe, expect, it } from 'vitest'

import { resetMockDb } from '@/shared/api'

import { DATA_ERRORS } from '@/shared/config'
import { createUser as userFixture } from '../testing'

import { getUsers, updateUser, createUser, toggleUserFavorite } from './userApi'

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

describe('атомарная запись лайка', () => {
  it.each(['self', 'missing-owner', 'missing-target'] as const)(
    'отклоняет %s без изменений',
    async (scenario) => {
      const before = await getUsers()
      const owner = before[0].id
      const target = before[1].id
      await expect(
        toggleUserFavorite(
          scenario === 'missing-owner' ? 'unknown' : owner,
          scenario === 'missing-target' ? 'unknown' : scenario === 'self' ? owner : target,
        ),
      ).rejects.toThrow(DATA_ERRORS.SAVE_USER)
      expect(await getUsers()).toEqual(before)
    },
  )

  it('не опускает нулевой счётчик ниже нуля при снятии старого лайка', async () => {
    const [owner, target] = await getUsers()
    await updateUser(owner.id, { likedUserIds: [target.id] })
    await updateUser(target.id, { likesCount: 0 })
    const result = await toggleUserFavorite(owner.id, target.id)
    expect(result[0].likedUserIds).toEqual([])
    expect(result[1].likesCount).toBe(0)
  })

  it('два владельца одновременно лайкают одного автора без потери счётчика', async () => {
    const [first, second, target] = await getUsers()
    await updateUser(first.id, { likedUserIds: [] })
    await updateUser(second.id, { likedUserIds: [] })
    await Promise.all([
      toggleUserFavorite(first.id, target.id),
      toggleUserFavorite(second.id, target.id),
    ])
    const result = await getUsers()
    expect(result.find((user) => user.id === first.id)?.likedUserIds).toEqual([target.id])
    expect(result.find((user) => user.id === second.id)?.likedUserIds).toEqual([target.id])
    expect(result.find((user) => user.id === target.id)?.likesCount).toBe(target.likesCount + 2)
  })
})
