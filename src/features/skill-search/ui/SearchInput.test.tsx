import { configureStore } from '@reduxjs/toolkit'
import { render as rtlRender, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Provider } from 'react-redux'
import type { ReactElement } from 'react'

import { searchReducer, selectSearchQuery } from '../model/searchSlice'
import { SearchInput } from './SearchInput'

const makeStore = () => configureStore({ reducer: { search: searchReducer } })

/** Рендер с реальным store, чтобы проверить и колбэки, и запись в searchSlice */
const render = (ui: ReactElement) => {
  const store = makeStore()
  const result = rtlRender(<Provider store={store}>{ui}</Provider>)
  return { ...result, store }
}

const getField = () => screen.getByRole('textbox', { name: 'Искать навык' })

describe('SearchInput', () => {
  it('показывает пустое поле с подсказкой и без крестика', () => {
    render(<SearchInput />)

    expect(getField()).toHaveAttribute('placeholder', 'Искать навык')
    expect(screen.queryByRole('button', { name: 'Очистить поиск' })).not.toBeInTheDocument()
  })

  it('запускает поиск по Enter, обрезая пробелы, и пишет запрос в store', async () => {
    const user = userEvent.setup()
    const onSearch = vi.fn()
    const { store } = render(<SearchInput onSearch={onSearch} />)

    await user.type(getField(), '  Гитара {Enter}')

    expect(onSearch).toHaveBeenCalledWith('Гитара')
    expect(selectSearchQuery(store.getState())).toBe('Гитара')
  })

  it('запускает поиск по клику на лупу и пишет запрос в store', async () => {
    const user = userEvent.setup()
    const onSearch = vi.fn()
    const { store } = render(<SearchInput onSearch={onSearch} />)

    await user.type(getField(), 'Йога')
    await user.click(screen.getByRole('button', { name: 'Искать' }))

    expect(onSearch).toHaveBeenCalledWith('Йога')
    expect(selectSearchQuery(store.getState())).toBe('Йога')
  })

  it('крестик появляется вместе с текстом, очищает поле и store', async () => {
    const user = userEvent.setup()
    const onClear = vi.fn()
    const { store } = render(<SearchInput onClear={onClear} />)

    await user.type(getField(), 'Йога')
    await user.click(screen.getByRole('button', { name: 'Искать' }))
    await user.click(screen.getByRole('button', { name: 'Очистить поиск' }))

    expect(getField()).toHaveValue('')
    expect(getField()).toHaveFocus()
    expect(onClear).toHaveBeenCalledTimes(1)
    expect(selectSearchQuery(store.getState())).toBe('')
    expect(screen.queryByRole('button', { name: 'Очистить поиск' })).not.toBeInTheDocument()
  })

  it('показывает начальный текст из defaultValue', () => {
    render(<SearchInput defaultValue="Гитара" />)

    expect(getField()).toHaveValue('Гитара')
  })

  it('без defaultValue берёт начальный текст из применённого запроса в store', () => {
    const store = configureStore({ reducer: { search: searchReducer } })
    store.dispatch({ type: 'search/queryApplied', payload: 'Игра на барабанах' })

    rtlRender(
      <Provider store={store}>
        <SearchInput />
      </Provider>,
    )

    expect(getField()).toHaveValue('Игра на барабанах')
  })

  it('defaultValue имеет приоритет над запросом в store', () => {
    const store = configureStore({ reducer: { search: searchReducer } })
    store.dispatch({ type: 'search/queryApplied', payload: 'Йога' })

    rtlRender(
      <Provider store={store}>
        <SearchInput defaultValue="Гитара" />
      </Provider>,
    )

    expect(getField()).toHaveValue('Гитара')
  })

  it('поиск по Enter с пустым полем сбрасывает store', async () => {
    const user = userEvent.setup()
    const store = configureStore({ reducer: { search: searchReducer } })
    store.dispatch({ type: 'search/queryApplied', payload: 'Йога' })

    rtlRender(
      <Provider store={store}>
        <SearchInput />
      </Provider>,
    )

    await user.clear(getField())
    await user.type(getField(), '{Enter}')

    expect(selectSearchQuery(store.getState())).toBe('')
  })
})
