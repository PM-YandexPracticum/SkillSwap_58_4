import { StrictMode } from 'react'
import { act, screen, within } from '@testing-library/react'

import { renderWithProviders } from '@/app/test/renderWithProviders'
import { fetchCategories } from '@/entities/category'
import categories from '../../../../public/db/categories.json'
import { CategoriesList } from './CategoriesList'

const preloadedState = { categories: { items: categories, status: 'succeeded' as const } }

describe('CategoriesList', () => {
  it('показывает все категории и подкатегории без ссылок и кнопок', () => {
    renderWithProviders(<CategoriesList />, { preloadedState })

    for (const category of categories) {
      expect(screen.getByRole('heading', { level: 2, name: category.title })).toBeInTheDocument()
      const list = screen.getByRole('list', { name: category.title })
      expect(within(list).getAllByRole('listitem')).toHaveLength(category.subcategories.length)
      for (const subcategory of category.subcategories) {
        expect(within(list).getByText(subcategory.title)).toBeInTheDocument()
      }
    }
    expect(screen.queryByRole('link')).not.toBeInTheDocument()
    expect(screen.queryByRole('button')).not.toBeInTheDocument()
  })

  it('загружает справочник из API при первом открытии', async () => {
    const { store } = renderWithProviders(<CategoriesList />)

    expect(screen.getByRole('status', { name: 'Загрузка' })).toBeInTheDocument()
    expect(await screen.findByRole('heading', { name: 'Бизнес и карьера' })).toBeInTheDocument()
    expect(store.getState().categories.items).toEqual(categories)
  })

  it('использует готовый справочник без повторного запроса', () => {
    const { store } = renderWithProviders(<CategoriesList />, { preloadedState })

    expect(store.getState().categories.status).toBe('succeeded')
    expect(screen.queryByRole('status')).not.toBeInTheDocument()
  })

  it('показывает ошибку и позволяет повторить загрузку', async () => {
    const { user } = renderWithProviders(<CategoriesList />, {
      preloadedState: { categories: { items: [], status: 'failed' } },
    })

    expect(screen.getByRole('alert')).toHaveTextContent('Не удалось загрузить категории')
    await user.click(screen.getByRole('button', { name: 'Попробовать снова' }))

    expect(await screen.findByRole('heading', { name: 'Бизнес и карьера' })).toBeInTheDocument()
    expect(screen.queryByRole('alert')).not.toBeInTheDocument()
  })

  it('сообщает о пустом справочнике без бесконечной загрузки', () => {
    renderWithProviders(<CategoriesList />, {
      preloadedState: { categories: { items: [], status: 'succeeded' } },
    })

    expect(screen.getByRole('status')).toHaveTextContent('Категории пока не добавлены')
    expect(screen.queryByRole('heading')).not.toBeInTheDocument()
  })

  it('сохраняет дополнительную категорию, даже если у неё пока нет подкатегорий', () => {
    const additionalCategory = {
      ...categories[0],
      id: 'new-category',
      title: 'Новая категория',
      icon: 'unknown',
      subcategories: [],
    }
    renderWithProviders(<CategoriesList />, {
      preloadedState: {
        categories: { items: [...categories, additionalCategory], status: 'succeeded' },
      },
    })

    expect(screen.getByRole('heading', { name: 'Новая категория' })).toBeInTheDocument()
    expect(
      within(screen.getByRole('list', { name: 'Новая категория' })).queryByRole('listitem'),
    ).not.toBeInTheDocument()
    expect(screen.getAllByRole('heading', { level: 2 })).toHaveLength(categories.length + 1)
  })

  it('показывает обновлённые категории после изменения store', () => {
    const { store } = renderWithProviders(<CategoriesList />, { preloadedState })

    act(() => store.dispatch(fetchCategories.fulfilled([], 'updated')))

    expect(screen.queryByRole('heading', { name: 'Бизнес и карьера' })).not.toBeInTheDocument()
    expect(screen.getByRole('status')).toHaveTextContent('Категории пока не добавлены')
  })

  it('загружает один справочник для двух списков и StrictMode', async () => {
    const { store } = renderWithProviders(
      <StrictMode>
        <CategoriesList />
        <CategoriesList />
      </StrictMode>,
    )

    expect(await screen.findAllByRole('heading', { name: 'Бизнес и карьера' })).toHaveLength(2)
    expect(store.getState().categories.status).toBe('succeeded')
  })
})
