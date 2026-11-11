import { act, screen, within } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import { renderWithProviders } from '@/app/test/renderWithProviders'
import { fetchCategories, type Category } from '@/entities/category'
import { FiltersPanel } from './FiltersPanel'

const category: Category = {
  id: 'art',
  title: 'Творчество и искусство',
  icon: 'palette',
  color: 'art',
  subcategories: [{ id: 'photo', categoryId: 'art', title: 'Фотография' }],
}

const preloadedState: Partial<RootState> = {
  categories: { items: [category], status: 'succeeded' },
  cities: { items: [{ id: 'moscow', name: 'Москва' }], status: 'succeeded' },
}

describe('FiltersPanel', () => {
  it('читает справочники из store и отображает группы с доступными названиями', () => {
    renderWithProviders(<FiltersPanel />, { preloadedState })
    expect(screen.getByRole('complementary', { name: 'Фильтры' })).toBeInTheDocument()
    expect(screen.getByRole('group', { name: 'Навыки' })).toBeInTheDocument()
    expect(screen.getByRole('group', { name: 'Город' })).toBeInTheDocument()
    expect(screen.getByRole('radiogroup', { name: 'Пол автора' })).toBeInTheDocument()
    expect(screen.getByRole('radiogroup', { name: 'Режим каталога' })).toBeInTheDocument()
    expect(screen.getByRole('checkbox', { name: category.title })).toBeInTheDocument()
    expect(screen.getByRole('checkbox', { name: 'Москва' })).toBeInTheDocument()
  })

  it('без filtersCount показывает заголовок «Фильтры»', () => {
    renderWithProviders(<FiltersPanel />, { preloadedState })
    expect(screen.getByRole('heading', { name: 'Фильтры' })).toBeInTheDocument()
  })

  it('с filtersCount = 0 показывает «Фильтры» без числа', () => {
    renderWithProviders(<FiltersPanel filtersCount={0} />, { preloadedState })
    expect(screen.getByRole('heading', { name: 'Фильтры' })).toBeInTheDocument()
  })

  it('рендерит «Фильтры (N)» из пропса filtersCount', () => {
    const { rerender } = renderWithProviders(<FiltersPanel filtersCount={0} />, {
      preloadedState,
    })
    expect(screen.getByRole('heading', { name: 'Фильтры' })).toBeInTheDocument()

    rerender(<FiltersPanel filtersCount={1} />)
    expect(screen.getByRole('heading', { name: 'Фильтры (1)' })).toBeInTheDocument()

    rerender(<FiltersPanel filtersCount={3} />)
    expect(screen.getByRole('heading', { name: 'Фильтры (3)' })).toBeInTheDocument()
  })

  it('вызывает onReset по кнопке «Сбросить» и не трогает store сам', async () => {
    const onReset = vi.fn()
    const { user, store } = renderWithProviders(<FiltersPanel onReset={onReset} />, {
      preloadedState,
    })

    // имитируем «родитель выставил фильтры» через store — панель их не считает
    act(() => {
      store.dispatch({ type: 'catalogFilter/setMode', payload: 'learn' })
    })
    const before = store.getState().catalogFilter

    await user.click(screen.getByRole('button', { name: 'Сбросить' }))
    expect(onReset).toHaveBeenCalledTimes(1)
    // FiltersPanel — «тупой»: сам resetFilters не диспатчит
    expect(store.getState().catalogFilter).toEqual(before)
  })

  it('клики по фильтрам меняют store (это делают сами фильтры, не панель)', async () => {
    const { user, store } = renderWithProviders(<FiltersPanel />, { preloadedState })

    await user.click(screen.getByRole('radio', { name: 'Хочу научиться' }))
    expect(store.getState().catalogFilter.mode).toBe('learn')

    await user.click(screen.getByRole('radio', { name: 'Женский' }))
    expect(store.getState().catalogFilter.gender).toBe('female')

    await user.click(screen.getByRole('checkbox', { name: 'Москва' }))
    expect(store.getState().catalogFilter.cityIds).toEqual(['moscow'])

    await user.click(screen.getByRole('checkbox', { name: category.title }))
    expect(store.getState().catalogFilter.subcategoryIds).toEqual(['photo'])
  })

  it('не падает на пустых справочниках и обновляется после их загрузки', async () => {
    const { store } = renderWithProviders(<FiltersPanel />)
    expect(screen.queryByRole('checkbox')).not.toBeInTheDocument()
    act(() => {
      store.dispatch(fetchCategories.fulfilled([category], 'request'))
    })
    expect(await screen.findByRole('checkbox', { name: category.title })).toBeInTheDocument()
  })

  it('отражает состояние store, установленное снаружи', () => {
    const { store } = renderWithProviders(<FiltersPanel />, { preloadedState })
    act(() => {
      store.dispatch({ type: 'catalogFilter/setMode', payload: 'teach' })
      store.dispatch({ type: 'catalogFilter/setGender', payload: 'male' })
      store.dispatch({ type: 'catalogFilter/toggleCity', payload: 'moscow' })
    })
    expect(screen.getByRole('radio', { name: 'Могу научить' })).toBeChecked()
    expect(screen.getByRole('radio', { name: 'Мужской' })).toBeChecked()
    expect(screen.getByRole('checkbox', { name: 'Москва' })).toBeChecked()
    // и НЕ показывает счётчик — это ответственность родителя
    expect(screen.getByRole('heading', { name: 'Фильтры' })).toBeInTheDocument()
  })

  it('две панели в одном store синхронизированы, но их id и radio-группы уникальны', async () => {
    const { user } = renderWithProviders(
      <>
        <FiltersPanel />
        <FiltersPanel />
      </>,
      { preloadedState },
    )
    const [first, second] = screen.getAllByRole('complementary')

    await user.click(within(first).getByRole('radio', { name: 'Хочу научиться' }))
    expect(within(second).getByRole('radio', { name: 'Хочу научиться' })).toBeChecked()

    const ids = [...document.querySelectorAll('[id]')].map((el) => el.id)
    expect(new Set(ids).size).toBe(ids.length)
  })
})
