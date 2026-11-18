import { createTestStore } from '@/app/test/createTestStore'
import { endSession } from '@/entities/session'
import { createCategory } from '@/entities/category/testing'
import { fetchSkills, getSkills } from '@/entities/skill'
import { createNewUser, fetchUsers, getUsers } from '@/entities/user'
import { createUser } from '@/entities/user/testing'
import { resetMockDb } from '@/shared/api'
import { DATA_ERRORS } from '@/shared/config'
import { draftUpdated, registerReset } from './registerSlice'
import { completeRegistration } from './completeRegistration'

const category = createCategory()
const otherCategory = createCategory({ id: 'creativity' })
const preloadedState: Partial<RootState> = {
  categories: { items: [category, otherCategory], status: 'succeeded' },
  cities: { items: [{ id: 'moscow', name: 'Москва' }], status: 'succeeded' },
}

function makeStore(
  cityId = 'moscow',
  subcategoryId = 'business-management',
  learnSubcategoryId = 'business-management',
) {
  const store = createTestStore(preloadedState)
  store.dispatch(
    draftUpdated({
      email: 'registration@example.com',
      password: 'Chernosliv5',
      name: 'Анна',
      birthDate: '2000-01-10',
      gender: null,
      cityId,
      learnCategoryIds: ['business'],
      learnSubcategoryIds: [learnSubcategoryId],
      skill: {
        title: 'Игра на барабанах',
        categoryId: 'business',
        subcategoryId,
        description: 'Научу основам техники',
        imagePreviewUrls: ['data:image/jpeg;base64,photo'],
      },
    }),
  )
  return store
}

function failStorageFor(collection: 'skills' | 'users') {
  const originalSetItem = Storage.prototype.setItem
  return vi.spyOn(Storage.prototype, 'setItem').mockImplementation(function (
    this: Storage,
    key,
    value,
  ) {
    if (key === `skillswap_db_${collection}`) {
      throw new DOMException('storage full', 'QuotaExceededError')
    }
    return originalSetItem.call(this, key, value)
  })
}

beforeEach(() => {
  localStorage.clear()
  resetMockDb()
})

afterEach(() => vi.restoreAllMocks())

describe('completeRegistration', () => {
  it.each([
    ['неизвестный город', 'missing-city', 'business-management', 'business-management', 'город'],
    [
      'подкатегория навыка из другой категории',
      'moscow',
      'creativity-management',
      'business-management',
      'подкатегорию',
    ],
    [
      'неизвестная желаемая подкатегория',
      'moscow',
      'business-management',
      'unknown-subcategory',
      'направления',
    ],
  ])(
    'отклоняет неверные связи до записи: %s',
    async (_scenario, city, subcategory, learnSubcategory, expectedMessage) => {
      const store = makeStore(city, subcategory, learnSubcategory)
      const usersBefore = await getUsers()
      const skillsBefore = await getSkills()

      const result = await store.dispatch(completeRegistration())

      expect(result.type).toBe(completeRegistration.rejected.type)
      expect(result.payload).toContain(expectedMessage)
      expect(await getUsers()).toEqual(usersBefore)
      expect(await getSkills()).toEqual(skillsBefore)
      expect(store.getState().register.draft.email).not.toBe('')
    },
  )

  it('сохраняет ID после отказа записи навыка и завершает повтор', async () => {
    const store = makeStore()
    const savedSkillsBefore = await getSkills()
    const storage = failStorageFor('skills')

    const failed = await store.dispatch(completeRegistration())
    const attempt = store.getState().register.draft.completion

    expect(failed).toMatchObject({
      type: completeRegistration.rejected.type,
      payload: DATA_ERRORS.STORAGE_FULL,
    })
    expect(attempt?.skillId).toEqual(expect.any(String))
    expect(store.getState().register.draft.email).not.toBe('')

    storage.mockRestore()
    const retried = await store.dispatch(completeRegistration()).unwrap()
    const savedSkills = await getSkills()
    const savedUsers = await getUsers()
    const savedUser = savedUsers.find((item) => item.email === 'registration@example.com')

    expect(savedSkills).toHaveLength(savedSkillsBefore.length + 1)
    expect(savedUser?.teachSkillId).toBe(attempt?.skillId)
    expect(savedSkills.find((item) => item.id === attempt?.skillId)?.authorId).toBe(savedUser?.id)
    const reloadedStore = createTestStore(preloadedState)
    reloadedStore.dispatch(endSession())
    await Promise.all([
      reloadedStore.dispatch(fetchUsers()).unwrap(),
      reloadedStore.dispatch(fetchSkills()).unwrap(),
    ])
    expect(
      reloadedStore.getState().users.items.find((item) => item.email === retried.user.email),
    ).toMatchObject({
      id: retried.user.id,
      password: retried.user.password,
      teachSkillId: retried.skill.id,
    })
    expect(
      reloadedStore.getState().skills.items.find((skill) => skill.id === retried.user.teachSkillId)
        ?.authorId,
    ).toBe(retried.user.id)
  })

  it('не дублирует навык при повторе после отказа записи пользователя', async () => {
    const store = makeStore()
    const savedSkillsBefore = await getSkills()
    const storage = failStorageFor('users')

    const failed = await store.dispatch(completeRegistration())
    const attempt = store.getState().register.draft.completion
    const afterFailure = await getSkills()

    expect(failed).toMatchObject({
      type: completeRegistration.rejected.type,
      payload: DATA_ERRORS.STORAGE_FULL,
    })
    expect(afterFailure.find((item) => item.id === attempt?.skillId)).toBeDefined()
    expect(afterFailure).toHaveLength(savedSkillsBefore.length + 1)
    expect(store.getState().session.session).toBeNull()
    expect(store.getState().register.draft.email).not.toBe('')

    storage.mockRestore()
    const retried = await store.dispatch(completeRegistration())
    const savedSkills = await getSkills()
    const savedUsers = await getUsers()
    const savedUser = savedUsers.find((item) => item.email === 'registration@example.com')

    expect(completeRegistration.fulfilled.match(retried)).toBe(true)
    expect(savedSkills).toHaveLength(savedSkillsBefore.length + 1)
    expect(savedUser?.teachSkillId).toBe(attempt?.skillId)
    expect(savedSkills.find((item) => item.id === attempt?.skillId)?.authorId).toBe(savedUser?.id)
    expect(store.getState().session.session?.userId).toBe(savedUser?.id)
  })

  it('не запускает второе завершение одновременно', async () => {
    const store = makeStore()

    const results = await Promise.all([
      store.dispatch(completeRegistration()),
      store.dispatch(completeRegistration()),
    ])

    expect(results.filter(completeRegistration.fulfilled.match)).toHaveLength(1)
    expect(results.filter(completeRegistration.rejected.match)).toHaveLength(1)
    expect(
      (await getUsers()).filter((item) => item.email === 'registration@example.com'),
    ).toHaveLength(1)
  })

  it('после сброса не записывает данные и не стирает новый черновик', async () => {
    const store = makeStore()
    const before = await getSkills()
    const request = store.dispatch(completeRegistration())
    store.dispatch(registerReset())
    store.dispatch(draftUpdated({ email: 'next@example.com' }))

    await request

    expect(await getSkills()).toEqual(before)
    expect(store.getState().session.session).toBeNull()
    expect(store.getState().register.draft.email).toBe('next@example.com')
    expect(store.getState().register.completionStatus).toBe('idle')
    expect(store.getState().register.completionError).toBeNull()
  })

  it('не создаёт сессию, если черновик сбросили во время записи пользователя', async () => {
    const store = makeStore()
    const setItem = Storage.prototype.setItem
    vi.spyOn(Storage.prototype, 'setItem').mockImplementation(function (this: Storage, key, value) {
      setItem.call(this, key, value)
      if (key === 'skillswap_db_users') {
        store.dispatch(registerReset())
        store.dispatch(draftUpdated({ email: 'next@example.com' }))
      }
    })

    await store.dispatch(completeRegistration())

    expect(store.getState().session.session).toBeNull()
    expect(store.getState().register.draft.email).toBe('next@example.com')
    expect(store.getState().register.completionError).toBeNull()
  })

  it('отмена после записи навыка не запускает запись пользователя', async () => {
    const store = makeStore()
    const before = await getUsers()
    const setItem = Storage.prototype.setItem
    let cancel = () => {}
    vi.spyOn(Storage.prototype, 'setItem').mockImplementation(function (this: Storage, key, value) {
      setItem.call(this, key, value)
      if (key === 'skillswap_db_skills') cancel()
    })
    const request = store.dispatch(completeRegistration())
    cancel = () => request.abort()
    await request
    // Abort завершает внешний thunk раньше уже начатой записи; чтение ждёт очередь коллекции.
    await getSkills()

    expect(await getUsers()).toEqual(before)
    expect(store.getState().session.session).toBeNull()
    expect(store.getState().register.completionStatus).toBe('idle')
    expect(store.getState().register.completionError).toBeNull()

    const attempt = store.getState().register.draft.completion
    const retried = await store.dispatch(completeRegistration()).unwrap()
    expect(retried.skill.id).toBe(attempt?.skillId)
    expect(retried.user.id).toBe(attempt?.userId)
  })

  it('после частичного сохранения обновляет фото навыка с прежними ID', async () => {
    const store = makeStore()
    const before = await getSkills()
    const storage = failStorageFor('users')
    await store.dispatch(completeRegistration())
    const attempt = store.getState().register.draft.completion
    storage.mockRestore()
    const skill = store.getState().register.draft.skill!
    store.dispatch(
      draftUpdated({ skill: { ...skill, imagePreviewUrls: ['data:image/jpeg;base64,smaller'] } }),
    )

    const result = await store.dispatch(completeRegistration()).unwrap()

    expect(result.skill.id).toBe(attempt?.skillId)
    expect(result.user.id).toBe(attempt?.userId)
    expect(result.skill.images).toEqual(['data:image/jpeg;base64,smaller'])
    expect(await getSkills()).toHaveLength(before.length + 1)
    expect(store.getState().skills.items.find((item) => item.id === result.skill.id)).toEqual(
      result.skill,
    )
  })

  it('после занятого email принимает исправление и не создаёт второй навык', async () => {
    const store = makeStore()
    await store.dispatch(createNewUser(createUser({ email: 'registration@example.com' }))).unwrap()
    const before = await getSkills()
    const failed = await store.dispatch(completeRegistration())
    expect(failed.payload).toBe(DATA_ERRORS.DUPLICATE_EMAIL)
    const attempt = store.getState().register.draft.completion
    store.dispatch(draftUpdated({ email: 'free@example.com' }))
    expect(store.getState().register.completionError).toBeNull()

    const result = await store.dispatch(completeRegistration()).unwrap()

    expect(result.user).toMatchObject({ id: attempt?.userId, email: 'free@example.com' })
    expect(result.skill.id).toBe(attempt?.skillId)
    expect(await getSkills()).toHaveLength(before.length + 1)
  })

  it('повтор после отмены во время записи пользователя восстанавливает ту же пару', async () => {
    const store = makeStore()
    const before = await getUsers()
    const setItem = Storage.prototype.setItem
    let cancel = () => {}
    vi.spyOn(Storage.prototype, 'setItem').mockImplementation(function (this: Storage, key, value) {
      setItem.call(this, key, value)
      if (key === 'skillswap_db_users') cancel()
    })
    const request = store.dispatch(completeRegistration())
    cancel = () => request.abort()
    await request
    await getUsers()
    expect(store.getState().session.session).toBeNull()
    const attempt = store.getState().register.draft.completion
    vi.restoreAllMocks()

    const result = await store.dispatch(completeRegistration()).unwrap()

    expect(result.user.id).toBe(attempt?.userId)
    expect(result.skill.id).toBe(attempt?.skillId)
    expect(await getUsers()).toHaveLength(before.length + 1)
    expect(store.getState().session.session?.userId).toBe(attempt?.userId)
  })
})
