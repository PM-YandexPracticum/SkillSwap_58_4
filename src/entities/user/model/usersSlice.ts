import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import type { LoadingStatus } from '@/shared/types'
import { DATA_ERRORS } from '@/shared/config'
import { shuffle } from '@/shared/lib/shuffle'
import type { User } from './types'
import { getUsers, createUser, updateUser } from '../api/userApi'

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
export const fetchUsers = createAsyncThunk<User[], void, { state: { users: UsersState } }>(
  'users/fetchUsers',
  async () => shuffle(await getUsers()),
  { condition: (_, { getState }) => getState().users.status !== 'loading' },
)

export const createNewUser = createAsyncThunk<User, User, { rejectValue: string }>(
  'user/createUser',
  async (userData: User, { getState, rejectWithValue }) => {
    const state = getState() as { users: UsersState }
    const users = state.users.items
    const doubleEmail = users.find(
      (item) => item.email.toLowerCase() === userData.email.toLowerCase(),
    )
    if (doubleEmail) {
      return rejectWithValue('Такой email уже существует, try again :)')
    }
    try {
      return await createUser(userData)
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : DATA_ERRORS.STORAGE_FULL)
    }
  },
)

export const updateDataUser = createAsyncThunk<
  User,
  { id: string; changes: Partial<Omit<User, 'id'>> },
  { rejectValue: string }
>('user/updateUser', async ({ id, changes }, { rejectWithValue }) => {
  try {
    return await updateUser(id, changes)
  } catch (error) {
    return rejectWithValue(error instanceof Error ? error.message : DATA_ERRORS.STORAGE_FULL)
  }
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
        state.error = null
      })
      .addCase(fetchUsers.rejected, (state) => {
        state.status = 'failed'
        state.error = DATA_ERRORS.LOAD_USERS
      })

    builder
      .addCase(createNewUser.fulfilled, (state, action) => {
        state.items = [...state.items, action.payload]
        state.status = 'succeeded'
        state.error = null
      })
      .addCase(createNewUser.pending, (state) => {
        state.status = 'loading'
        state.error = null
      })
      .addCase(createNewUser.rejected, (state, action) => {
        state.status = 'failed'
        state.error = action.payload ?? action.error.message ?? DATA_ERRORS.STORAGE_FULL
      })

    builder
      .addCase(updateDataUser.pending, (state) => {
        state.status = 'loading'
        state.error = null
      })
      .addCase(updateDataUser.fulfilled, (state, action) => {
        state.status = 'succeeded'
        state.items = state.items.map((user) =>
          user.id === action.payload.id ? action.payload : user,
        )
        state.error = null
      })
      .addCase(updateDataUser.rejected, (state, action) => {
        state.status = 'failed'
        state.error = action.payload ?? action.error.message ?? DATA_ERRORS.STORAGE_FULL
      })
  },
})

export const usersReducer = usersSlice.reducer
