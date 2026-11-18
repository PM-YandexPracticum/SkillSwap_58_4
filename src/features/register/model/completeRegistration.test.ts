import { createTestStore } from '@/app/test/createTestStore'
import { endSession } from '@/entities/session'
import { createCategory } from '@/entities/category/testing'
import { getSkills } from '@/entities/skill'
import { fetchUsers, getUsers } from '@/entities/user'
import { resetMockDb } from '@/shared/api'
import { DATA_ERRORS } from '@/shared/config'
import { draftUpdated } from './registerSlice'
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
      email: `registration-${Math.random()}@example.com`,
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
    ['unknown city', 'missing-city', 'business-management', 'business-management', 'город'],
    [
      'skill subcategory outside its category',
      'moscow',
      'creativity-management',
      'business-management',
      'подкатегорию',
    ],
    [
      'unknown desired subcategory',
      'moscow',
      'business-management',
      'unknown-subcategory',
      'направления',
    ],
  ])(
    'rejects invalid registration references (%s) before either write',
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

  it('keeps the same ids after the skill write fails, then completes on retry', async () => {
    const store = makeStore()
    const savedSkillsBefore = await getSkills()
    const storage = failStorageFor('skills')

    const failed = await store.dispatch(completeRegistration())
    const attempt = store.getState().register.draft.completion

    expect(failed).toMatchObject({
      type: completeRegistration.rejected.type,
      payload: DATA_ERRORS.STORAGE_FULL,
    })
    expect(attempt).toMatchObject({ skillSaved: false })
    expect(store.getState().register.draft.email).not.toBe('')

    storage.mockRestore()
    const retried = await store.dispatch(completeRegistration()).unwrap()
    const savedSkills = await getSkills()
    const savedUsers = await getUsers()
    const savedUser = savedUsers.find((item) => item.email.startsWith('registration-'))

    expect(savedSkills).toHaveLength(savedSkillsBefore.length + 1)
    expect(savedUser?.teachSkillId).toBe(attempt?.skillId)
    expect(savedSkills.find((item) => item.id === attempt?.skillId)?.authorId).toBe(savedUser?.id)
    const reloadedStore = createTestStore(preloadedState)
    reloadedStore.dispatch(endSession())
    await reloadedStore.dispatch(fetchUsers()).unwrap()
    expect(
      reloadedStore.getState().users.items.find((item) => item.email === retried.user.email),
    ).toMatchObject({
      id: retried.user.id,
      password: retried.user.password,
      teachSkillId: retried.skill.id,
    })
  })

  it('does not duplicate the saved skill when the user write fails and is retried', async () => {
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
    expect(attempt).toMatchObject({ skillSaved: true })
    expect(afterFailure).toHaveLength(savedSkillsBefore.length + 1)
    expect(store.getState().session.session).toBeNull()
    expect(store.getState().register.draft.email).not.toBe('')

    storage.mockRestore()
    const retried = await store.dispatch(completeRegistration())
    const savedSkills = await getSkills()
    const savedUsers = await getUsers()
    const savedUser = savedUsers.find((item) => item.email.startsWith('registration-'))

    expect(completeRegistration.fulfilled.match(retried)).toBe(true)
    expect(savedSkills).toHaveLength(savedSkillsBefore.length + 1)
    expect(savedUser?.teachSkillId).toBe(attempt?.skillId)
    expect(savedSkills.find((item) => item.id === attempt?.skillId)?.authorId).toBe(savedUser?.id)
    expect(store.getState().session.session?.userId).toBe(savedUser?.id)
  })

  it('ignores a concurrent second completion', async () => {
    const store = makeStore()

    const results = await Promise.all([
      store.dispatch(completeRegistration()),
      store.dispatch(completeRegistration()),
    ])

    expect(results.filter(completeRegistration.fulfilled.match)).toHaveLength(1)
    expect(results.filter(completeRegistration.rejected.match)).toHaveLength(1)
    expect(
      (await getUsers()).filter((item) => item.email.startsWith('registration-')),
    ).toHaveLength(1)
  })
})
