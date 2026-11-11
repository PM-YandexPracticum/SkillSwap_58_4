import { act, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { renderWithProviders } from '@/app/test/renderWithProviders'
import type { Category } from '@/entities/category'
import { CATALOG } from '@/shared/config'
import { resetFilters, toggleSubcategory } from '../model/catalogFilterSlice'
import { SkillsFilter } from './SkillsFilter'

const category: Category = {
  id: 'art',
  title: 'Творчество и искусство',
  icon: 'palette',
  color: 'art',
  subcategories: [
    { id: 'photo', categoryId: 'art', title: 'Фотография' },
    { id: 'drawing', categoryId: 'art', title: 'Рисование' },
  ],
}

describe('SkillsFilter', () => {
  it('обрабатывает пустой справочник', () => {
    renderWithProviders(<SkillsFilter categories={[]} />)
    expect(screen.getByRole('group', { name: 'Навыки' })).toBeInTheDocument()
    expect(screen.queryByRole('checkbox')).not.toBeInTheDocument()
    expect(screen.queryByRole('button')).not.toBeInTheDocument()
  })

  it('раскрывает категорию с клавиатуры и связывает кнопку со списком', async () => {
    const { user } = renderWithProviders(<SkillsFilter categories={[category]} />)
    const button = screen.getByRole('button', { name: `Развернуть категорию «${category.title}»` })
    expect(button).toHaveAttribute('aria-expanded', 'false')
    expect(screen.queryByRole('checkbox', { name: 'Фотография' })).not.toBeInTheDocument()
    button.focus()
    await user.keyboard(' ')
    expect(button).toHaveAttribute('aria-expanded', 'true')
    expect(document.getElementById(button.getAttribute('aria-controls')!)).toBeVisible()
    expect(screen.getByRole('checkbox', { name: 'Фотография' })).toBeInTheDocument()
  })

  it('переходит из частичного выбора в полный и снимает всю категорию', async () => {
    const { user, store } = renderWithProviders(<SkillsFilter categories={[category]} />)
    await user.click(screen.getByRole('button', { name: /Развернуть категорию/ }))
    const parent = screen.getByRole('checkbox', { name: category.title })
    await user.click(screen.getByRole('checkbox', { name: 'Фотография' }))
    expect(parent).toBePartiallyChecked()
    expect(store.getState().catalogFilter.subcategoryIds).toEqual(['photo'])

    await user.click(parent)
    expect(parent).toBeChecked()
    expect(parent).not.toBePartiallyChecked()
    expect(screen.getByRole('checkbox', { name: 'Рисование' })).toBeChecked()
    expect([...store.getState().catalogFilter.subcategoryIds].sort()).toEqual(['drawing', 'photo'])

    await user.click(parent)
    for (const checkbox of screen.getAllByRole('checkbox')) {
      expect(checkbox).not.toBeChecked()
    }
    expect(store.getState().catalogFilter.subcategoryIds).toEqual([])
  })

  it('пересчитывает родительскую галочку по выбору подкатегорий', async () => {
    const { user } = renderWithProviders(<SkillsFilter categories={[category]} />)
    await user.click(screen.getByRole('button', { name: /Развернуть категорию/ }))
    await user.click(screen.getByRole('checkbox', { name: 'Фотография' }))
    await user.click(screen.getByRole('checkbox', { name: 'Рисование' }))
    expect(screen.getByRole('checkbox', { name: category.title })).toBeChecked()
    await user.click(screen.getByRole('checkbox', { name: 'Рисование' }))
    expect(screen.getByRole('checkbox', { name: category.title })).toBePartiallyChecked()
  })

  it('сохраняет выбор после сворачивания подкатегорий', async () => {
    const { user, store } = renderWithProviders(<SkillsFilter categories={[category]} />)
    await user.click(screen.getByRole('button', { name: /Развернуть категорию/ }))
    await user.click(screen.getByRole('checkbox', { name: 'Фотография' }))
    await user.click(screen.getByRole('button', { name: /Свернуть категорию/ }))
    await user.click(screen.getByRole('button', { name: /Развернуть категорию/ }))
    expect(screen.getByRole('checkbox', { name: 'Фотография' })).toBeChecked()
    expect(store.getState().catalogFilter.subcategoryIds).toEqual(['photo'])
  })

  it('раскрывает и сворачивает оставшиеся категории', async () => {
    const { user } = renderWithProviders(<SkillsFilter categories={categoriesMany} />)
    const lastName = categoriesMany.at(-1)!.title
    expect(screen.queryByRole('checkbox', { name: lastName })).not.toBeInTheDocument()
    await user.click(screen.getByRole('button', { name: 'Все категории' }))
    expect(screen.getByRole('checkbox', { name: lastName })).toBeInTheDocument()
    await user.click(screen.getByRole('button', { name: 'Свернуть категории' }))
    expect(screen.queryByRole('checkbox', { name: lastName })).not.toBeInTheDocument()
  })

  it('отражает subcategoryIds из store после обновления справочника', async () => {
    const { store, rerender } = renderWithProviders(<SkillsFilter categories={[category]} />)

    act(() => {
      store.dispatch(toggleSubcategory('photo'))
    })
    expect(screen.getByRole('checkbox', { name: category.title })).toBePartiallyChecked()

    rerender(
      <SkillsFilter
        categories={[
          {
            ...category,
            subcategories: [
              ...category.subcategories,
              { id: 'music', categoryId: category.id, title: 'Музыка' },
            ],
          },
        ]}
      />,
    )
    // photo выбран, music — нет, значит категория остаётся частично выбранной
    expect(screen.getByRole('checkbox', { name: category.title })).toBePartiallyChecked()
    expect(store.getState().catalogFilter.subcategoryIds).toEqual(['photo'])
  })

  it('выбор одной категории не меняет другую', async () => {
    const { user, store } = renderWithProviders(
      <SkillsFilter categories={[category, otherCategory]} />,
    )
    await user.click(screen.getByRole('checkbox', { name: otherCategory.title }))
    await user.click(screen.getByRole('checkbox', { name: category.title }))
    await user.click(screen.getByRole('checkbox', { name: category.title }))
    expect(screen.getByRole('checkbox', { name: otherCategory.title })).toBeChecked()
    expect(screen.getByRole('checkbox', { name: category.title })).not.toBeChecked()
    expect(store.getState().catalogFilter.subcategoryIds).toEqual(['english'])
  })

  it('сохраняет выбор и раскрытие скрытой категории после «Свернуть категории»', async () => {
    const { user, store } = renderWithProviders(<SkillsFilter categories={hiddenCategorySetup} />)
    await user.click(screen.getByRole('button', { name: 'Все категории' }))
    await user.click(screen.getByRole('button', { name: /Развернуть категорию/ }))
    await user.click(screen.getByRole('checkbox', { name: 'Фотография' }))
    await user.click(screen.getByRole('button', { name: 'Свернуть категории' }))
    await user.click(screen.getByRole('button', { name: 'Все категории' }))
    expect(screen.getByRole('checkbox', { name: 'Фотография' })).toBeChecked()
    expect(store.getState().catalogFilter.subcategoryIds).toEqual(['photo'])
  })

  it('не предлагает выбирать или раскрывать категорию без подкатегорий', () => {
    renderWithProviders(<SkillsFilter categories={[{ ...category, subcategories: [] }]} />)
    expect(screen.getByRole('checkbox', { name: category.title })).toBeDisabled()
    expect(screen.queryByRole('button')).not.toBeInTheDocument()
  })

  it('сбрасывается через resetFilters', async () => {
    const { user, store } = renderWithProviders(<SkillsFilter categories={[category]} />)
    await user.click(screen.getByRole('checkbox', { name: category.title }))
    expect([...store.getState().catalogFilter.subcategoryIds].sort()).toEqual(['drawing', 'photo'])

    act(() => {
      store.dispatch(resetFilters())
    })
    for (const checkbox of screen.getAllByRole('checkbox')) {
      expect(checkbox).not.toBeChecked()
    }
  })
})

// --- фикстуры для тестов, где нужно много категорий -------------------------

const otherCategory: Category = {
  ...category,
  id: 'languages',
  title: 'Языки',
  subcategories: [{ id: 'english', categoryId: 'languages', title: 'Английский' }],
}

const categoriesMany: Category[] = Array.from(
  { length: CATALOG.CATEGORIES_VISIBLE + 1 },
  (_, index) => ({
    ...category,
    id: `category-${index}`,
    title: `Категория ${index}`,
    subcategories: [],
  }),
)

const hiddenCategorySetup: Category[] = [
  ...Array.from({ length: CATALOG.CATEGORIES_VISIBLE }, (_, index) => ({
    ...category,
    id: `empty-${index}`,
    title: `Пустая ${index}`,
    subcategories: [],
  })),
  category,
]
