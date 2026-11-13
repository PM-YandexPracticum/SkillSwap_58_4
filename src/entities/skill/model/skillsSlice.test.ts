import { configureStore } from '@reduxjs/toolkit'
import { DATA_ERRORS, MOCK_DB } from '@/shared/config'
import { createSkill } from '../testing'
import { fetchSkills, skillsReducer, createNewSkill, getSkills, type SkillsState } from '..'

const initial: SkillsState = {
  saveStatus: 'idle' as const,
  pendingSaves: 0,
  saveError: null,
  items: [],
  status: 'idle',
  error: null,
}
const skill = createSkill()

afterEach(() => vi.restoreAllMocks())

describe('skillsSlice', () => {
  it('начальное состояние — idle без данных и ошибки', () => {
    expect(skillsReducer(undefined, { type: 'unknown' })).toEqual(initial)
  })

  it('pending сбрасывает ошибку и сохраняет ранее загруженные навыки', () => {
    const state = skillsReducer(
      {
        ...initial,
        items: [skill],
        status: 'failed',
        error: DATA_ERRORS.LOAD_SKILLS,
      },
      fetchSkills.pending('req'),
    )

    expect(state).toEqual({
      ...initial,
      items: [skill],
      status: 'loading',
      error: null,
    })
  })

  it('fulfilled заменяет данные и сбрасывает ошибку', () => {
    const state = skillsReducer(
      {
        ...initial,
        items: [],
        status: 'loading',
        error: DATA_ERRORS.LOAD_SKILLS,
      },
      fetchSkills.fulfilled([skill], 'req'),
    )

    expect(state).toEqual({
      ...initial,
      items: [skill],
      status: 'succeeded',
      error: null,
    })
  })

  it('rejected сохраняет данные и сообщает понятную ошибку', () => {
    const state = skillsReducer(
      {
        ...initial,
        items: [skill],
        status: 'loading',
        error: null,
      },
      fetchSkills.rejected(new Error('technical details'), 'req'),
    )

    expect(state).toEqual({
      ...initial,
      items: [skill],
      status: 'failed',
      error: DATA_ERRORS.LOAD_SKILLS,
    })
  })

  it('после ошибки допускает успешную повторную загрузку пустой коллекции', () => {
    const failed = skillsReducer(initial, fetchSkills.rejected(new Error('failed'), 'first'))
    const loading = skillsReducer(failed, fetchSkills.pending('retry'))
    const loaded = skillsReducer(loading, fetchSkills.fulfilled([], 'retry'))

    expect(loaded).toEqual({
      ...initial,
      items: [],
      status: 'succeeded',
      error: null,
    })
  })

  it('неуспешный HTTP-ответ даёт failed, повторный запрос восстанавливает данные', async () => {
    // Новый загрузчик без кеша public/db: тест не зависит от порядка остальных тестов.
    vi.resetModules()
    const { fetchSkills, skillsReducer } = await import('..')
    const store = configureStore({ reducer: { skills: skillsReducer } })
    const fetch = vi
      .spyOn(globalThis, 'fetch')
      .mockResolvedValueOnce(new Response('', { status: 500 }))

    const failed = await store.dispatch(fetchSkills())

    expect(fetchSkills.rejected.match(failed)).toBe(true)
    expect(store.getState().skills).toEqual({
      ...initial,
      items: [],
      status: 'failed',
      error: DATA_ERRORS.LOAD_SKILLS,
    })
    fetch.mockRestore()

    await store.dispatch(fetchSkills()).unwrap()

    expect(store.getState().skills.status).toBe('succeeded')
    expect(store.getState().skills.error).toBeNull()
  })

  it('загружает все навыки из public/db', async () => {
    const { default: skills } = await import('../../../../public/db/skills.json')
    const store = configureStore({ reducer: { skills: skillsReducer } })

    await store.dispatch(fetchSkills()).unwrap()

    expect(store.getState().skills).toEqual({
      ...initial,
      items: skills,
      status: 'succeeded',
      error: null,
    })
  })

  it('читает сохранённый навык из localStorage вместо образцов', async () => {
    localStorage.setItem(`${MOCK_DB.STORAGE_PREFIX}skills`, JSON.stringify([skill]))
    const store = configureStore({ reducer: { skills: skillsReducer } })

    await store.dispatch(fetchSkills()).unwrap()

    expect(store.getState().skills.items).toEqual([skill])
  })
})

describe('fetchSkills — параллельный запрос', () => {
  it('не запускает второй запрос, пока первый не завершился', async () => {
    const store = configureStore({ reducer: { skills: skillsReducer } })
    store.dispatch(fetchSkills.pending('first'))
    const second = await store.dispatch(fetchSkills())
    expect(second.meta).toMatchObject({ condition: true })
    expect(store.getState().skills.status).toBe('loading')
  })
})

const makeStore = () => configureStore({ reducer: { skills: skillsReducer } })

describe('сохранение навыков (P4-06)', () => {
  it('пишет в базу до обновления store, не меняет статус загрузки и читается новым store', async () => {
    const store = makeStore()
    await store.dispatch(fetchSkills()).unwrap()
    const previous = store.getState().skills.items
    const skill = createSkill()
    const request = store.dispatch(createNewSkill(skill))
    expect(store.getState().skills).toMatchObject({
      status: 'succeeded',
      saveStatus: 'loading',
      items: previous,
    })
    await request.unwrap()
    expect(previous).not.toContainEqual(skill)
    expect(store.getState().skills.items.at(-1)).toEqual(skill)
    const reloaded = makeStore()
    await reloaded.dispatch(fetchSkills()).unwrap()
    expect(reloaded.getState().skills.items).toContainEqual(skill)
  })

  it('при нехватке места не меняет ни базу, ни список; повтор очищает ошибку', async () => {
    const store = makeStore()
    await store.dispatch(fetchSkills()).unwrap()
    const previous = store.getState().skills.items
    const storage = vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {
      throw new DOMException('quota', 'QuotaExceededError')
    })
    const result = await store.dispatch(createNewSkill(createSkill()))
    expect(result).toMatchObject({
      type: createNewSkill.rejected.type,
      payload: DATA_ERRORS.STORAGE_FULL,
    })
    expect(store.getState().skills).toMatchObject({
      status: 'succeeded',
      saveStatus: 'failed',
      saveError: DATA_ERRORS.STORAGE_FULL,
      items: previous,
      error: null,
    })
    expect(await getSkills()).toEqual(previous)
    storage.mockRestore()
    await store.dispatch(createNewSkill(createSkill())).unwrap()
    expect(store.getState().skills).toMatchObject({
      saveStatus: 'succeeded',
      saveError: null,
      pendingSaves: 0,
    })
  })

  it('повтор id не добавляет дубль и не показывает техническую ошибку', async () => {
    const store = makeStore()
    await store.dispatch(createNewSkill(createSkill())).unwrap()
    const result = await store.dispatch(createNewSkill(createSkill()))
    expect(result).toMatchObject({
      type: createNewSkill.rejected.type,
      payload: DATA_ERRORS.SAVE_SKILL,
    })
    expect(store.getState().skills.items).toHaveLength(1)
    expect(store.getState().skills.status).toBe('idle')
  })

  it('учитывает все параллельные записи и не теряет ошибку после успешного ответа', () => {
    const skill = createSkill()
    let state = skillsReducer(undefined, createNewSkill.pending('one', skill))
    state = skillsReducer(state, createNewSkill.pending('two', skill))
    state = skillsReducer(
      state,
      createNewSkill.rejected(new Error('failure'), 'one', skill, DATA_ERRORS.SAVE_SKILL),
    )
    expect(state).toMatchObject({ saveStatus: 'loading', pendingSaves: 1 })
    state = skillsReducer(state, createNewSkill.fulfilled(skill, 'two', skill))
    expect(state).toMatchObject({
      saveStatus: 'failed',
      saveError: DATA_ERRORS.SAVE_SKILL,
      pendingSaves: 0,
      status: 'idle',
    })
  })
})

it.each(['load-first', 'save-first'])(
  'параллельная загрузка и создание навыка (%s) не дублируют запись',
  async (order) => {
    const store = makeStore()
    const skill = createSkill()
    const load = () => store.dispatch(fetchSkills()).unwrap()
    const save = () => store.dispatch(createNewSkill(skill)).unwrap()
    await Promise.all(order === 'load-first' ? [load(), save()] : [save(), load()])
    expect(store.getState().skills.items.filter((item) => item.id === skill.id)).toEqual([skill])
  },
)
