import { createAsyncThunk, createSlice, isAnyOf } from '@reduxjs/toolkit'
import { DATA_ERRORS } from '@/shared/config'
import { shuffle } from '@/shared/lib/shuffle'
import type { LoadingStatus } from '@/shared/types'
import { createUser, getUsers, updateUser } from '../api/userApi'
import type { User } from './types'

export interface UsersState {
  /** Порядок «Рекомендуем»: перемешивается в fetchUsers, обновления записей его сохраняют. */
  items: User[]
  /** Только стартовая/явная загрузка; DataProvider не реагирует на запись. */
  status: LoadingStatus
  error: string | null
  /** Состояние сохранения отдельно от загрузки. */
  saveStatus: LoadingStatus
  pendingSaves: number
  saveError: string | null
}

const initialState: UsersState = {
  items: [],
  status: 'idle',
  error: null,
  saveStatus: 'idle',
  pendingSaves: 0,
  saveError: null,
}

/** Загружает пользователей и один раз перемешивает их для «Рекомендуем». */
export const fetchUsers = createAsyncThunk<User[], void, { state: { users: UsersState } }>(
  'users/fetchUsers',
  async () => shuffle(await getUsers()),
  { condition: (_, { getState }) => getState().users.status !== 'loading' },
)

/** Только ожидаемые сообщения API передаём в UI; остальные ошибки заменяем понятным текстом. */
function saveError(error: unknown): string {
  const message = error instanceof Error ? error.message : ''
  return message === DATA_ERRORS.DUPLICATE_EMAIL || message === DATA_ERRORS.STORAGE_FULL
    ? message
    : DATA_ERRORS.SAVE_USER
}

/** Сохраняет нового пользователя. Окончательная проверка email выполняется в API в одной очереди с записью. */
export const createNewUser = createAsyncThunk<User, User, { rejectValue: string }>(
  'users/create',
  async (user, { rejectWithValue }) => {
    try {
      return await createUser(user)
    } catch (error) {
      return rejectWithValue(saveError(error))
    }
  },
)

/** Сохраняет изменения профиля или лайков; API возвращает новую запись. */
export const updateDataUser = createAsyncThunk<
  User,
  { id: string; changes: Partial<Omit<User, 'id'>> },
  { rejectValue: string }
>('users/update', async ({ id, changes }, { rejectWithValue }) => {
  try {
    return await updateUser(id, changes)
  } catch (error) {
    return rejectWithValue(saveError(error))
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
      .addMatcher(isAnyOf(createNewUser.pending, updateDataUser.pending), (state) => {
        if (state.pendingSaves === 0) state.saveError = null
        state.pendingSaves += 1
        state.saveStatus = 'loading'
      })
      .addMatcher(isAnyOf(createNewUser.fulfilled, updateDataUser.fulfilled), (state, action) => {
        const saved = action.payload
        state.items = state.items.some((user) => user.id === saved.id)
          ? state.items.map((user) => (user.id === saved.id ? saved : user))
          : [...state.items, saved]
        state.pendingSaves = Math.max(0, state.pendingSaves - 1)
        state.saveStatus =
          state.pendingSaves > 0 ? 'loading' : state.saveError ? 'failed' : 'succeeded'
      })
      .addMatcher(isAnyOf(createNewUser.rejected, updateDataUser.rejected), (state, action) => {
        state.pendingSaves = Math.max(0, state.pendingSaves - 1)
        state.saveStatus = state.pendingSaves > 0 ? 'loading' : 'failed'
        state.saveError = action.payload ?? DATA_ERRORS.SAVE_USER
      })
  },
})

export const usersReducer = usersSlice.reducer
