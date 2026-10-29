import { createSlice } from '@reduxjs/toolkit'
import type { Exchange } from './types'

export interface ExchangesState {
  items: Exchange[]
}

const initialState: ExchangesState = {
  items: [],
}

/**
 * Все обмены текущего пользователя (входящие = «Заявки», исходящие и принятые = «Мои обмены»).
 * Загружаются и сохраняются через `entities/exchange/api` («база» в localStorage).
 * TODO: exchangeAdded — без мутаций; дубль (тот же fromUserId + toUserId) не добавлять
 */
export const exchangesSlice = createSlice({
  name: 'exchanges',
  initialState,
  reducers: {},
})

export const exchangesReducer = exchangesSlice.reducer
