import { completeRegistration } from './completeRegistration'
import { createTestStore } from '@/app/test/createTestStore'

import {
  draftUpdated,
  registerReducer,
  registerReset,
  selectCompletedStep,
  selectRegisterDraft,
  stepCompleted,
} from './registerSlice'

const initial = registerReducer(undefined, { type: '@@init' })

describe('registerSlice', () => {
  it('в начале черновик пуст и ни один шаг не пройден', () => {
    expect(initial.completedStep).toBe(0)
    expect(initial.draft.email).toBe('')
    expect(initial.draft.skill).toBeNull()
  })

  it('draftUpdated дописывает поля и не трогает остальные', () => {
    const afterStep1 = registerReducer(
      initial,
      draftUpdated({ email: 'new@mail.ru', password: 'Chernosliv5' }),
    )
    const afterStep2 = registerReducer(afterStep1, draftUpdated({ name: 'Мария' }))

    expect(afterStep2.draft).toMatchObject({
      email: 'new@mail.ru',
      password: 'Chernosliv5',
      name: 'Мария',
    })
  })

  it('draftUpdated не меняет прежнее состояние', () => {
    const next = registerReducer(initial, draftUpdated({ email: 'new@mail.ru' }))

    expect(next).not.toBe(initial)
    expect(initial.draft.email).toBe('')
  })

  it('stepCompleted запоминает пройденный шаг', () => {
    expect(registerReducer(initial, stepCompleted(1)).completedStep).toBe(1)
  })

  it('stepCompleted не уменьшает номер: «Далее» на шаге 1 после шага 2 не сбрасывает прогресс', () => {
    const afterStep2 = registerReducer(registerReducer(initial, stepCompleted(1)), stepCompleted(2))

    expect(registerReducer(afterStep2, stepCompleted(1)).completedStep).toBe(2)
  })

  it('registerReset очищает черновик и прогресс', () => {
    const filled = registerReducer(
      registerReducer(initial, draftUpdated({ email: 'new@mail.ru', name: 'Мария' })),
      stepCompleted(2),
    )

    expect(registerReducer(filled, registerReset())).toEqual(initial)
  })

  it('селекторы читают черновик и шаг из общего store', () => {
    const store = createTestStore()
    store.dispatch(draftUpdated({ email: 'new@mail.ru' }))
    store.dispatch(stepCompleted(1))

    expect(selectCompletedStep(store.getState())).toBe(1)
    expect(selectRegisterDraft(store.getState()).email).toBe('new@mail.ru')
  })

  it('игнорирует ошибку старого запроса после запуска нового', () => {
    let state = registerReducer(initial, completeRegistration.pending('old', undefined))
    state = registerReducer(state, registerReset())
    state = registerReducer(state, completeRegistration.pending('new', undefined))
    const next = registerReducer(
      state,
      completeRegistration.rejected(new Error('old'), 'old', undefined, 'Старая ошибка'),
    )

    expect(next).toEqual(state)
    expect(next.completionStatus).toBe('loading')
    expect(next.completionError).toBeNull()
  })
})
