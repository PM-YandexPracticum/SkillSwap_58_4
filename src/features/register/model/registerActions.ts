import { createAction } from '@reduxjs/toolkit'
import type { RegisterDraft } from './types'

export const registerReset = createAction('register/registerReset')
/** Прекращает завершение при уходе со шага, сохраняя данные для возврата. */
export const registrationCancelled = createAction<string>('register/registrationCancelled')
export const registrationAttemptPrepared = createAction<NonNullable<RegisterDraft['completion']>>(
  'register/registrationAttemptPrepared',
)
