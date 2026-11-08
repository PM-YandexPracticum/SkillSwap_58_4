import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import type { LoadingStatus } from '@/shared/types'
import type { Skill } from './types'
import { getSkills } from '../api/skillApi'

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
export const fetchSkills = createAsyncThunk('skills/fetchSkills', async () => {
  return await getSkills()
})

export const skillsSlice = createSlice({
  name: 'skills',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(fetchSkills.pending, (state) => {
      state.status = 'loading'
      state.error = null
    })
    builder.addCase(fetchSkills.fulfilled, (state, action) => {
      state.status = 'succeeded'
      state.items = action.payload
      state.error = null
    })
    builder.addCase(fetchSkills.rejected, (state) => {
      state.status = 'failed'
      state.error = 'Ошибка загрузки навыков'
    })
  },
})

export const skillsReducer = skillsSlice.reducer
