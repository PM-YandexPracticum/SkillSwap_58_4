import { createSlice } from '@reduxjs/toolkit'
import type { LoadingStatus } from '@/shared/types'
import type { User } from './types'

export interface UsersState {
  items: User[]
  status: LoadingStatus
  error: string | null
}

const initialState: UsersState = {
  items: [],
  status: 'idle',
  error: null,
}

/**
 * Все пользователи из «базы» (`entities/user/api`), включая зарегистрированных.
 * TODO: fetchUsers (createAsyncThunk);
 * TODO: userAdded(user) — после регистрации; userUpdated({ id, changes }) — профиль и лайки
 */
export const usersSlice = createSlice({
  name: 'users',
  initialState,
  reducers: {},
})

export const usersReducer = usersSlice.reducer
