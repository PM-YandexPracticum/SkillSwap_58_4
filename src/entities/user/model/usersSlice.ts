import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import type { LoadingStatus } from '@/shared/types'
import { DATA_ERRORS } from '@/shared/config'
import { shuffle } from '@/shared/lib/shuffle'
import type { User } from './types'
import { getUsers } from '../api/userApi'

export interface UsersState {
  /** Порядок «Рекомендуем»: перемешивается в fetchUsers, обновления записей его сохраняют. */
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
 * Порядок «Рекомендуем» формируется один раз на успешную загрузку.
 * Сохранение регистрации, профиля и лайков — P4-06.
 */
export const fetchUsers = createAsyncThunk<User[]>('users/fetchUsers', async () =>
  shuffle(await getUsers()),
)

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
        state.error = null
      })
      .addCase(fetchUsers.rejected, (state) => {
        state.status = 'failed'
        state.error = DATA_ERRORS.LOAD_USERS
      })
  },
})

export const usersReducer = usersSlice.reducer
