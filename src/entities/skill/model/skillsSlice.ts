import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import type { LoadingStatus } from '@/shared/types'
import { DATA_ERRORS } from '@/shared/config'
import type { Skill } from './types'
import { getSkills, createSkill } from '../api/skillApi'

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
 * Сохранение нового навыка при регистрации — P4-06.
 */
export const fetchSkills = createAsyncThunk<Skill[]>('skills/fetchSkills', async () => getSkills())

export const createNewSkill = createAsyncThunk<Skill, Skill, { rejectValue: string }>(
  'skill/createSkill',
  async (skill, { rejectWithValue }) => {
    try {
      return await createSkill(skill)
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : DATA_ERRORS.STORAGE_FULL)
    }
  },
)

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
      state.error = DATA_ERRORS.LOAD_SKILLS
    })

    builder
      .addCase(createNewSkill.pending, (state) => {
        state.status = 'loading'
        state.error = null
      })
      .addCase(createNewSkill.fulfilled, (state, action) => {
        state.status = 'succeeded'
        state.items = [...state.items, action.payload]
        state.error = null
      })
      .addCase(createNewSkill.rejected, (state, action) => {
        state.status = 'failed'
        state.error = action.payload ?? action.error.message ?? DATA_ERRORS.STORAGE_FULL
      })
  },
})

export const skillsReducer = skillsSlice.reducer
