import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import type { LoadingStatus } from '@/shared/types'
import type { User } from './types'
import { getUsers } from '../api/userApi'
import { act } from 'react-dom/test-utils'
import { error } from 'console'
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
const fetchUsers = createAsyncThunk<User[]>('users/fetchUsers', async () => {
  return await getUsers()
})

export const usersSlice = createSlice({
  name: 'users',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchUsers.pending, (state) => {
        state.status = 'loading'
        state.error = null
      })
      .addCase(fetchUsers.fulfilled, (state, action) => {
        state.status = 'succeeded'
        state.items = action.payload
      })
      .addCase(fetchUsers.rejected, (state) => {
        state.status = 'failed'
        state.error = 'Ошибка загрузки пользователей'
      })
  },
})

export const usersReducer = usersSlice.reducer
