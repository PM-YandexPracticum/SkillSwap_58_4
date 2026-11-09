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

  it('принимает счётчик и передаёт нажатие сброса наружу', async () => {
    const onReset = vi.fn()
    const { user } = renderWithProviders(<FiltersPanel filtersCount={2} onReset={onReset} />)
    expect(screen.getByRole('heading', { name: 'Фильтры (2)' })).toBeInTheDocument()
    await user.click(screen.getByRole('button', { name: 'Сбросить' }))
    expect(onReset).toHaveBeenCalledTimes(1)
  })

  it('не падает на пустых справочниках и обновляется после их загрузки', async () => {
    const { store } = renderWithProviders(<FiltersPanel />)
    expect(screen.queryByRole('checkbox')).not.toBeInTheDocument()
    act(() => {
      store.dispatch(fetchCategories.fulfilled([category], 'request'))
    })
    expect(await screen.findByRole('checkbox', { name: category.title })).toBeInTheDocument()
  })

  it('визуальный выбор не меняет фильтры Redux до P5-02', async () => {
    const { user, store } = renderWithProviders(<FiltersPanel />, { preloadedState })
    const before = store.getState().catalogFilter
    await user.click(screen.getByRole('radio', { name: 'Хочу научиться' }))
    await user.click(screen.getByRole('radio', { name: 'Женский' }))
    await user.click(screen.getByRole('checkbox', { name: 'Москва' }))
    await user.click(screen.getByRole('checkbox', { name: category.title }))
    expect(store.getState().catalogFilter).toEqual(before)
    expect(screen.getByRole('radio', { name: 'Хочу научиться' })).toBeChecked()
    expect(screen.getByRole('radio', { name: 'Женский' })).toBeChecked()
  })

  it('независимые панели не связывают радиокнопки и идентификаторы', async () => {
    const { user } = renderWithProviders(
      <>
        <FiltersPanel />
        <FiltersPanel />
      </>,
    )
    const panels = screen.getAllByRole('complementary')
    await user.click(within(panels[0]).getByRole('radio', { name: 'Хочу научиться' }))
    expect(within(panels[1]).getByRole('radio', { name: 'Всё' })).toBeChecked()
    const ids = [...document.querySelectorAll('[id]')].map((element) => element.id)
    expect(new Set(ids).size).toBe(ids.length)
  })
})
