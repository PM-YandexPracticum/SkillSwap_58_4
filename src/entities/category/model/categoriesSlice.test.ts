import { configureStore } from '@reduxjs/toolkit'

import categoriesFromDb from '../../../../public/db/categories.json'

import { categoriesReducer, fetchCategories, type CategoriesState } from './categoriesSlice'
import type { Category } from './types'

const CATEGORY: Category = {
  id: 'business',
  title: 'Бизнес и карьера',
  icon: 'business',
  color: '#EEE7F7',
  subcategories: [],
}

const initial: CategoriesState = { items: [], status: 'idle' }

describe('categoriesSlice', () => {
  it('pending — статус loading', () => {
    expect(categoriesReducer(initial, fetchCategories.pending('req')).status).toBe('loading')
  })

  it('fulfilled — категории в store и статус succeeded', () => {
    const state = categoriesReducer(initial, fetchCategories.fulfilled([CATEGORY], 'req'))

    expect(state).toEqual({ items: [CATEGORY], status: 'succeeded' })
  })

  // Ошибку проверяем через редьюсер: файл «базы» после первой загрузки берётся из памяти, подмена fetch его не затронет
  it('rejected — статус failed', () => {
    const state = categoriesReducer(
      { items: [], status: 'loading' },
      fetchCategories.rejected(new Error('Не удалось загрузить данные'), 'req'),
    )

    expect(state.status).toBe('failed')
  })

  it('fetchCategories загружает все категории из «базы»', async () => {
    const store = configureStore({ reducer: { categories: categoriesReducer } })

    await store.dispatch(fetchCategories())

    expect(store.getState().categories.status).toBe('succeeded')
    expect(store.getState().categories.items).toEqual(categoriesFromDb)
  })
})
