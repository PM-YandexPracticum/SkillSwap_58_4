import { act, screen } from '@testing-library/react'

import { renderWithProviders } from '@/app/test/renderWithProviders'
import { queryApplied, queryCleared, selectSearchQuery } from '../model/searchSlice'
import { SearchInput } from './SearchInput'

const getField = () => screen.getByRole('textbox', { name: 'Искать навык' })

describe('SearchInput', () => {
  it('показывает пустое поле с подсказкой и без крестика', () => {
    renderWithProviders(<SearchInput />)

    expect(getField()).toHaveAttribute('placeholder', 'Искать навык')
    expect(screen.queryByRole('button', { name: 'Очистить поиск' })).not.toBeInTheDocument()
  })

  it.each(['Enter', 'лупа'])(
    'применяет запрос один раз через %s и обрезает пробелы',
    async (method) => {
      const onSearch = vi.fn()
      const { store, user } = renderWithProviders(<SearchInput onSearch={onSearch} />)
      await user.type(getField(), '  Гитара  ')

      if (method === 'Enter') await user.keyboard('{Enter}')
      else await user.click(screen.getByRole('button', { name: 'Искать' }))

      expect(onSearch).toHaveBeenCalledTimes(1)
      expect(onSearch).toHaveBeenCalledWith('Гитара')
      expect(selectSearchQuery(store.getState())).toBe('Гитара')
    },
  )

  it('не применяет набираемый текст до подтверждения', async () => {
    const onSearch = vi.fn()
    const { store, user } = renderWithProviders(<SearchInput onSearch={onSearch} />, {
      preloadedState: { search: { query: 'Йога' } },
    })
    await user.clear(getField())
    await user.type(getField(), 'Гитара')

    expect(selectSearchQuery(store.getState())).toBe('Йога')
    expect(onSearch).not.toHaveBeenCalled()
  })

  it('крестик очищает поле и store и возвращает фокус', async () => {
    const onClear = vi.fn()
    const { store, user } = renderWithProviders(<SearchInput onClear={onClear} />, {
      preloadedState: { search: { query: 'Йога' } },
    })

    await user.click(screen.getByRole('button', { name: 'Очистить поиск' }))

    expect(getField()).toHaveValue('')
    expect(getField()).toHaveFocus()
    expect(onClear).toHaveBeenCalledTimes(1)
    expect(selectSearchQuery(store.getState())).toBe('')
    expect(screen.queryByRole('button', { name: 'Очистить поиск' })).not.toBeInTheDocument()
  })

  it('позволяет очистить поиск с клавиатуры', async () => {
    const { user } = renderWithProviders(<SearchInput />, {
      preloadedState: { search: { query: 'Йога' } },
    })
    await user.click(getField())
    await user.tab()
    expect(screen.getByRole('button', { name: 'Очистить поиск' })).toHaveFocus()

    await user.keyboard('{Enter}')

    expect(getField()).toHaveValue('')
    expect(getField()).toHaveFocus()
  })

  it('показывает начальный текст из store', () => {
    renderWithProviders(<SearchInput />, {
      preloadedState: { search: { query: 'Игра на барабанах' } },
    })

    expect(getField()).toHaveValue('Игра на барабанах')
  })

  it('defaultValue задаёт начальный черновик с приоритетом над store', () => {
    renderWithProviders(<SearchInput defaultValue="Гитара" />, {
      preloadedState: { search: { query: 'Йога' } },
    })

    expect(getField()).toHaveValue('Гитара')
  })

  it.each([
    ['Enter', ''],
    ['Enter', '   '],
    ['лупа', ''],
    ['лупа', '   '],
  ])('сбрасывает применённый поиск через %s с запросом "%s"', async (method, text) => {
    const { store, user } = renderWithProviders(<SearchInput />, {
      preloadedState: { search: { query: 'Йога' } },
    })
    await user.clear(getField())
    if (text) await user.type(getField(), text)

    if (method === 'Enter') await user.keyboard('{Enter}')
    else await user.click(screen.getByRole('button', { name: 'Искать' }))

    expect(selectSearchQuery(store.getState())).toBe('')
  })

  it.each(['Йога', ''])(
    'внешний сброс очищает черновик при применённом запросе "%s"',
    async (query) => {
      const onClear = vi.fn()
      const { store, user } = renderWithProviders(<SearchInput onClear={onClear} />, {
        preloadedState: { search: { query } },
      })
      await user.clear(getField())
      await user.type(getField(), 'Новый черновик')

      act(() => store.dispatch(queryCleared()))

      expect(getField()).toHaveValue('')
      expect(onClear).not.toHaveBeenCalled()
    },
  )

  it.each(['Йога', 'Гитара'])('внешний запрос "%s" заменяет черновик', async (query) => {
    const onSearch = vi.fn()
    const { store, user } = renderWithProviders(<SearchInput onSearch={onSearch} />, {
      preloadedState: { search: { query: 'Йога' } },
    })
    await user.clear(getField())
    await user.type(getField(), 'Новый черновик')

    act(() => store.dispatch(queryApplied(query)))

    expect(getField()).toHaveValue(query)
    expect(onSearch).not.toHaveBeenCalled()
  })
})
