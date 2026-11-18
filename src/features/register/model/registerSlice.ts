import { createSlice, type PayloadAction } from '@reduxjs/toolkit'
import { DATA_ERRORS } from '@/shared/config'
import type { LoadingStatus } from '@/shared/types'
import type { RegisterDraft } from './types'
import { completeRegistration } from './completeRegistration'
import {
  registerReset,
  registrationAttemptPrepared,
  registrationCancelled,
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
  /** Только этот запрос может менять результат текущего черновика. */
  completionRequestId: string | null
}

const initialState: RegisterState = {
  completedStep: 0,
  completionStatus: 'idle',
  completionError: null,
  completionRequestId: null,
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
 * - `draftUpdated(partial)` — дописать поля шага и убрать прежнюю ошибку; id попытки сохраняются для повтора;
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
      state.completionError = null
      if (state.completionStatus === 'failed') state.completionStatus = 'idle'
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
      .addCase(registrationCancelled, (state, action) => {
        if (state.completionRequestId !== action.payload) return
        state.completionRequestId = null
        state.completionStatus = 'idle'
        state.completionError = null
      })
      .addCase(registrationAttemptPrepared, (state, action) => {
        state.draft.completion = action.payload
      })
      .addCase(completeRegistration.pending, (state, action) => {
        state.completionRequestId = action.meta.requestId
        state.completionStatus = 'loading'
        state.completionError = null
      })
      .addCase(completeRegistration.fulfilled, (state, action) => {
        if (state.completionRequestId !== action.meta.requestId) return
        // Черновик больше не нужен. Прогресс сохраняем до перехода: иначе guard
        // размонтирует шаг 3 раньше его navigate в каталог. При выходе lifecycle сбросит всё.
        state.draft = initialState.draft
        state.completionRequestId = null
        state.completionStatus = 'succeeded'
        state.completionError = null
      })
      .addCase(completeRegistration.rejected, (state, action) => {
        if (state.completionRequestId !== action.meta.requestId) return
        state.completionRequestId = null
        state.completionStatus = action.meta.aborted ? 'idle' : 'failed'
        state.completionError = action.meta.aborted
          ? null
          : (action.payload ?? DATA_ERRORS.SAVE_USER)
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
