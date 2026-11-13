export {
  StepCredentials,
  type StepCredentialsProps,
  type CredentialsValues,
} from './ui/StepCredentials'
export { StepProfile } from './ui/StepProfile'
export { StepSkill } from './ui/StepSkill'
export {
  registerReducer,
  draftUpdated,
  stepCompleted,
  registerReset,
  selectCompletedStep,
  selectRegisterDraft,
  type RegisterState,
  type RegisterStep,
} from './model/registerSlice'
export type { RegisterDraft } from './model/types'
