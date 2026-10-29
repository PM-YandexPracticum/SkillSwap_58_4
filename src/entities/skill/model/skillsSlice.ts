import { createSlice } from '@reduxjs/toolkit'
import type { LoadingStatus } from '@/shared/types'
import type { Skill } from './types'

export interface SkillsState {
  items: Skill[]
  status: LoadingStatus
  error: string | null
}

const initialState: SkillsState = {
  items: [],
  status: 'idle',
  error: null,
}

/**
 * Все навыки из «базы» (`entities/skill/api`): образцы + созданные при регистрации.
 * TODO: fetchSkills (createAsyncThunk), addSkill
 */
export const skillsSlice = createSlice({
  name: 'skills',
  initialState,
  reducers: {},
})

export const skillsReducer = skillsSlice.reducer
