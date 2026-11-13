import { createSlice, type PayloadAction } from '@reduxjs/toolkit'
import type { RegisterDraft } from './types'

/** Номер шага регистрации */
export type RegisterStep = 1 | 2 | 3

export interface RegisterState {
  /**
   * Последний пройденный шаг (0 — ещё ничего). На шаг N можно попасть, только если пройден шаг N − 1:
   * прямой заход по адресу `/register/step-2` без шага 1 перекидывает на шаг 1 (`RegisterStepGuard`).
   */
  completedStep: 0 | RegisterStep
  draft: RegisterDraft
}

const initialState: RegisterState = {
  completedStep: 0,
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
 * После «Готово» пользователь всегда попадает в каталог (ТЗ наставника, 2.6).
 *
 * - `draftUpdated(partial)` — дописать поля шага в черновик, остальные не трогаются;
 * - `stepCompleted(step)` — шаг пройден («Далее» / «Продолжить»). Номер только растёт: вернулся на шаг 1
 *   и снова нажал «Далее» — шаг 2 остаётся пройденным, если был пройден;
 * - `registerReset()` — пустой черновик и ни одного пройденного шага.
 *
 * Файлы фото в store не кладём — только превью (см. `RegisterDraft`). Состояние живёт только в памяти:
 * после перезагрузки страницы черновика нет, и `RegisterStepGuard` возвращает со шагов 2–3 на шаг 1.
 */
export const registerSlice = createSlice({
  name: 'register',
  initialState,
  reducers: {
    draftUpdated(state, action: PayloadAction<Partial<RegisterDraft>>) {
      state.draft = { ...state.draft, ...action.payload }
    },
    stepCompleted(state, action: PayloadAction<RegisterStep>) {
      if (action.payload > state.completedStep) {
        state.completedStep = action.payload
      }
    },
    registerReset: () => initialState,
  },
})

export const { draftUpdated, stepCompleted, registerReset } = registerSlice.actions

export const registerReducer = registerSlice.reducer

/** Последний пройденный шаг — для RegisterStepGuard */
export const selectCompletedStep = (state: RootState) => state.register.completedStep

/** Всё, что введено на шагах, — чтобы после «Назад» поля были заполнены */
export const selectRegisterDraft = (state: RootState) => state.register.draft
