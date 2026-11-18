import { createAction } from '@reduxjs/toolkit'
import type { RegisterDraft } from './types'

export const registerReset = createAction('register/registerReset')
export const registrationAttemptPrepared = createAction<NonNullable<RegisterDraft['completion']>>(
  'register/registrationAttemptPrepared',
)
export const registrationSkillSaved = createAction('register/registrationSkillSaved')
