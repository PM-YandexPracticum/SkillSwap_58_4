import { createSlice } from '@reduxjs/toolkit'
import type { RegisterDraft } from './types'

export interface RegisterState {
  /**
   * Последний пройденный шаг (0 — ещё ничего). На шаг N можно попасть, только если пройден шаг N − 1:
   * прямой заход по адресу `/register/step-2` без шага 1 перекидывает на шаг 1 (`RegisterStepGuard`).
   */
  completedStep: 0 | 1 | 2 | 3
  /**
   * Куда вернуть пользователя после «Готово»: страница, с которой гость нажал «Предложить обмен» / лайк,
   * или каталог, если пришёл через «Зарегистрироваться».
   */
  returnTo: string | null
  draft: RegisterDraft
}

const initialState: RegisterState = {
  completedStep: 0,
  returnTo: null,
  draft: {
    email: '',
    password: '',
    name: '',
    avatarPreviewUrl: null,
    birthDate: '',
    gender: null,
    cityId: '',
    learnCategoryIds: [],
    learnSubcategoryIds: [],
    skill: null,
  },
}

/**
 * Черновик регистрации из 3 шагов. «Назад» не стирает введённое, «Закрыть ×» — сбрасывает черновик.
 * TODO: stepCompleted(step), returnToSet(path), draftUpdated(partial), registerReset
 */
export const registerSlice = createSlice({
  name: 'register',
  initialState,
  reducers: {},
})

export const registerReducer = registerSlice.reducer

/** Последний пройденный шаг — для RegisterStepGuard */
export const selectCompletedStep = (state: RootState) => state.register.completedStep
