import { createAsyncThunk, createSlice, isAnyOf } from '@reduxjs/toolkit'
import { DATA_ERRORS } from '@/shared/config'
import type { LoadingStatus } from '@/shared/types'

import {
  completeExchangeProposal as completeProposal,
  createExchange,
  getExchanges,
} from '../api/exchangeApi'
import type { Exchange } from './types'

export interface ExchangesState {
  items: Exchange[]
  status: LoadingStatus
  pendingRequests: number
  error: string | null
}

const initialState: ExchangesState = { items: [], status: 'idle', pendingRequests: 0, error: null }

/** Загрузка сохранённых предложений. Видимость текущему пользователю определяют селекторы. */
export const fetchExchanges = createAsyncThunk<Exchange[], void, { rejectValue: string }>(
  'exchanges/fetch',
  async (_, { rejectWithValue }) => {
    try {
      return await getExchanges()
    } catch {
      return rejectWithValue(DATA_ERRORS.LOAD_EXCHANGES)
    }
  },
)

/** Сначала сохраняет предложение в «базу», затем обновляет store. Без сессии запись запрещена. */
export const addExchange = createAsyncThunk<
  Exchange,
  Exchange,
  { state: RootState; rejectValue: string }
>('exchanges/add', async (exchange, { getState, rejectWithValue }) => {
  const userId = getState().session.session?.userId
  if (!userId) return rejectWithValue(DATA_ERRORS.SIGN_IN)
  if (userId !== exchange.fromUserId) return rejectWithValue(DATA_ERRORS.OWNER)
  try {
    return await createExchange(exchange)
  } catch (error) {
    const message = error instanceof Error ? error.message : ''
    return rejectWithValue(
      message === DATA_ERRORS.DUPLICATE_EXCHANGE || message === DATA_ERRORS.STORAGE_FULL
        ? message
        : DATA_ERRORS.SAVE_EXCHANGE,
    )
  }
})

/** Убирает технический признак незавершённой записи после сохранения уведомления. */
export const completeExchangeProposal = createAsyncThunk<
  Exchange,
  string,
  { state: RootState; rejectValue: string }
>('exchanges/completeProposal', async (id, { getState, rejectWithValue }) => {
  const userId = getState().session.session?.userId
  if (!userId) return rejectWithValue(DATA_ERRORS.SIGN_IN)
  try {
    return await completeProposal(id, userId)
  } catch (error) {
    return rejectWithValue(
      error instanceof Error &&
        [DATA_ERRORS.STORAGE_FULL, DATA_ERRORS.OWNER].some((message) => message === error.message)
        ? error.message
        : DATA_ERRORS.SAVE_EXCHANGE,
    )
  }
})

/** Номинальные предложения: без принятия/отклонения. Запись — только через асинхронные операции API. */
export const exchangesSlice = createSlice({
  name: 'exchanges',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchExchanges.fulfilled, (state, action) => {
        state.items = action.payload
      })
      .addCase(addExchange.fulfilled, (state, action) => {
        state.items = [
          ...state.items.filter((item) => item.id !== action.payload.id),
          action.payload,
        ]
      })
      .addCase(completeExchangeProposal.fulfilled, (state, action) => {
        state.items = state.items.map((item) =>
          item.id === action.payload.id ? action.payload : item,
        )
      })
      .addMatcher(
        isAnyOf(fetchExchanges.pending, addExchange.pending, completeExchangeProposal.pending),
        (state) => {
          if (state.pendingRequests === 0) state.error = null
          state.pendingRequests += 1
          state.status = 'loading'
        },
      )
      .addMatcher(
        isAnyOf(
          fetchExchanges.fulfilled,
          addExchange.fulfilled,
          completeExchangeProposal.fulfilled,
        ),
        (state) => {
          state.pendingRequests = Math.max(0, state.pendingRequests - 1)
          state.status =
            state.pendingRequests > 0 ? 'loading' : state.error ? 'failed' : 'succeeded'
        },
      )
      .addMatcher(
        isAnyOf(fetchExchanges.rejected, addExchange.rejected, completeExchangeProposal.rejected),
        (state, action) => {
          state.pendingRequests = Math.max(0, state.pendingRequests - 1)
          state.status = state.pendingRequests > 0 ? 'loading' : 'failed'
          state.error = action.payload ?? DATA_ERRORS.LOAD_EXCHANGES
        },
      )
  },
})
export const exchangesReducer = exchangesSlice.reducer
