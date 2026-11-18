import { createSlice, type PayloadAction } from '@reduxjs/toolkit'
import { DATA_ERRORS } from '@/shared/config'
import type { LoadingStatus } from '@/shared/types'
import type { RegisterDraft } from './types'
import { completeRegistration } from './completeRegistration'
import {
  registerReset,
  registrationAttemptPrepared,
  registrationSkillSaved,
} from './registerActions'

/** Номер шага регистрации */
export type RegisterStep = 1 | 2 | 3

export interface RegisterState {
  /**
   * Последний пройденный шаг (0 — ещё ничего). На шаг N можно попасть, только если пройден шаг N − 1:
   * прямой заход по адресу `/register/step-2` без шага 1 перекидывает на шаг 1 (`RegisterStepGuard`).
   */
  completedStep: 0 | RegisterStep
  draft: RegisterDraft
  completionStatus: LoadingStatus
  completionError: string | null
}

const initialState: RegisterState = {
  completedStep: 0,
  completionStatus: 'idle',
  completionError: null,
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
    completion: null,
  },
}

/**
 * Черновик регистрации из 3 шагов. «Назад» не стирает введённое, «Закрыть ×» — сбрасывает черновик.
 * После «Готово» пользователь всегда попадает в каталог (ТЗ наставника, 2.6).
 *
 * - `draftUpdated(partial)` — дописать поля шага в черновик; при изменении навыка сбрасывает состояние его записи;
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
    draftUpdated(state, action: PayloadAction<Partial<Omit<RegisterDraft, 'completion'>>>) {
      state.draft = { ...state.draft, ...action.payload }
      if (Object.prototype.hasOwnProperty.call(action.payload, 'skill')) {
        state.draft.completion = null
      }
    },
    stepCompleted(state, action: PayloadAction<RegisterStep>) {
      if (action.payload > state.completedStep) {
        state.completedStep = action.payload
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(registerReset, () => initialState)
      .addCase(registrationAttemptPrepared, (state, action) => {
        state.draft.completion = action.payload
      })
      .addCase(registrationSkillSaved, (state) => {
        if (state.draft.completion) state.draft.completion.skillSaved = true
      })
      .addCase(completeRegistration.pending, (state) => {
        state.completionStatus = 'loading'
        state.completionError = null
      })
      .addCase(completeRegistration.fulfilled, (state) => {
        state.completionStatus = 'succeeded'
        state.completionError = null
      })
      .addCase(completeRegistration.rejected, (state, action) => {
        state.completionStatus = 'failed'
        state.completionError = action.payload ?? DATA_ERRORS.SAVE_USER
      })
  },
})

export const { draftUpdated, stepCompleted } = registerSlice.actions

export { registerReset }

export const registerReducer = registerSlice.reducer

/** Последний пройденный шаг — для RegisterStepGuard */
export const selectCompletedStep = (state: RootState) => state.register.completedStep

/** Всё, что введено на шагах, — чтобы после «Назад» поля были заполнены */
export const selectRegisterDraft = (state: RootState) => state.register.draft

/** Состояние отправки «Готово» и её понятная ошибка для превью. */
export const selectRegistrationStatus = (state: RootState) => state.register.completionStatus
export const selectRegistrationError = (state: RootState) => state.register.completionError
