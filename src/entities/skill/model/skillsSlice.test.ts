import { configureStore } from '@reduxjs/toolkit'
import { DATA_ERRORS, MOCK_DB } from '@/shared/config'
import { createSkill } from '../testing'
import { fetchSkills, skillsReducer, type SkillsState } from '..'

const initial: SkillsState = { items: [], status: 'idle', error: null }
const skill = createSkill()

afterEach(() => vi.restoreAllMocks())

describe('skillsSlice', () => {
  it('начальное состояние — idle без данных и ошибки', () => {
    expect(skillsReducer(undefined, { type: 'unknown' })).toEqual(initial)
  })

  it('pending сбрасывает ошибку и сохраняет ранее загруженные навыки', () => {
    const state = skillsReducer(
      { items: [skill], status: 'failed', error: DATA_ERRORS.LOAD_SKILLS },
      fetchSkills.pending('req'),
    )

    expect(state).toEqual({ items: [skill], status: 'loading', error: null })
  })

  it('fulfilled заменяет данные и сбрасывает ошибку', () => {
    const state = skillsReducer(
      { items: [], status: 'loading', error: DATA_ERRORS.LOAD_SKILLS },
      fetchSkills.fulfilled([skill], 'req'),
    )

    expect(state).toEqual({ items: [skill], status: 'succeeded', error: null })
  })

  it('rejected сохраняет данные и сообщает понятную ошибку', () => {
    const state = skillsReducer(
      { items: [skill], status: 'loading', error: null },
      fetchSkills.rejected(new Error('technical details'), 'req'),
    )

    expect(state).toEqual({ items: [skill], status: 'failed', error: DATA_ERRORS.LOAD_SKILLS })
  })

  it('после ошибки допускает успешную повторную загрузку пустой коллекции', () => {
    const failed = skillsReducer(initial, fetchSkills.rejected(new Error('failed'), 'first'))
    const loading = skillsReducer(failed, fetchSkills.pending('retry'))
    const loaded = skillsReducer(loading, fetchSkills.fulfilled([], 'retry'))

    expect(loaded).toEqual({ items: [], status: 'succeeded', error: null })
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

    expect(store.getState().skills).toEqual({ items: skills, status: 'succeeded', error: null })
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
