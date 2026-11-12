import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { DATA_ERRORS } from '@/shared/config'
import type { LoadingStatus } from '@/shared/types'
import { createSkill, getSkills } from '../api/skillApi'
import type { Skill } from './types'

export interface SkillsState {
  items: Skill[]
  /** Только стартовая/явная загрузка; DataProvider не реагирует на запись. */
  status: LoadingStatus
  error: string | null
  /** Состояние сохранения отдельно от загрузки. */
  saveStatus: LoadingStatus
  pendingSaves: number
  saveError: string | null
}

const initialState: SkillsState = {
  items: [],
  status: 'idle',
  error: null,
  saveStatus: 'idle',
  pendingSaves: 0,
  saveError: null,
}

/** Загружает навыки из API. */
export const fetchSkills = createAsyncThunk<Skill[], void, { state: { skills: SkillsState } }>(
  'skills/fetchSkills',
  async () => getSkills(),
  { condition: (_, { getState }) => getState().skills.status !== 'loading' },
)

/** Сохраняет новый навык и возвращает запись для store. */
export const createNewSkill = createAsyncThunk<Skill, Skill, { rejectValue: string }>(
  'skills/create',
  async (skill, { rejectWithValue }) => {
    try {
      return await createSkill(skill)
    } catch (error) {
      return rejectWithValue(
        error instanceof Error && error.message === DATA_ERRORS.STORAGE_FULL
          ? DATA_ERRORS.STORAGE_FULL
          : DATA_ERRORS.SAVE_SKILL,
      )
    }
  },
)

export const skillsSlice = createSlice({
  name: 'skills',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchSkills.pending, (state) => {
        state.status = 'loading'
        state.error = null
      })
      .addCase(fetchSkills.fulfilled, (state, action) => {
        state.status = 'succeeded'
        state.items = action.payload
        state.error = null
      })
      .addCase(fetchSkills.rejected, (state) => {
        state.status = 'failed'
        state.error = DATA_ERRORS.LOAD_SKILLS
      })
      .addCase(createNewSkill.pending, (state) => {
        if (state.pendingSaves === 0) state.saveError = null
        state.pendingSaves += 1
        state.saveStatus = 'loading'
      })
      .addCase(createNewSkill.fulfilled, (state, action) => {
        const saved = action.payload
        state.items = state.items.some((skill) => skill.id === saved.id)
          ? state.items.map((skill) => (skill.id === saved.id ? saved : skill))
          : [...state.items, saved]
        state.pendingSaves = Math.max(0, state.pendingSaves - 1)
        state.saveStatus =
          state.pendingSaves > 0 ? 'loading' : state.saveError ? 'failed' : 'succeeded'
      })
      .addCase(createNewSkill.rejected, (state, action) => {
        state.pendingSaves = Math.max(0, state.pendingSaves - 1)
        state.saveStatus = state.pendingSaves > 0 ? 'loading' : 'failed'
        state.saveError = action.payload ?? DATA_ERRORS.SAVE_SKILL
      })
  },
})

export const skillsReducer = skillsSlice.reducer
