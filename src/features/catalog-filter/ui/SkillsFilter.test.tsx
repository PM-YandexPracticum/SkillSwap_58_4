import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it } from 'vitest'
import type { Category } from '@/entities/category'
import { CATALOG } from '@/shared/config'
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
    render(<SkillsFilter categories={[]} />)
    expect(screen.getByRole('group', { name: 'Навыки' })).toBeInTheDocument()
    expect(screen.queryByRole('checkbox')).not.toBeInTheDocument()
    expect(screen.queryByRole('button')).not.toBeInTheDocument()
  })

  it('раскрывает категорию с клавиатуры и связывает кнопку со списком', async () => {
    const user = userEvent.setup()
    render(<SkillsFilter categories={[category]} />)
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
    const user = userEvent.setup()
    render(<SkillsFilter categories={[category]} />)
    await user.click(screen.getByRole('button', { name: /Развернуть категорию/ }))
    const parent = screen.getByRole('checkbox', { name: category.title })
    await user.click(screen.getByRole('checkbox', { name: 'Фотография' }))
    expect(parent).toBePartiallyChecked()
    await user.click(parent)
    expect(parent).toBeChecked()
    expect(parent).not.toBePartiallyChecked()
    expect(screen.getByRole('checkbox', { name: 'Рисование' })).toBeChecked()
    await user.click(parent)
    for (const checkbox of screen.getAllByRole('checkbox')) {
      expect(checkbox).not.toBeChecked()
    }
  })

  it('пересчитывает родительскую галочку по выбору подкатегорий', async () => {
    const user = userEvent.setup()
    render(<SkillsFilter categories={[category]} />)
    await user.click(screen.getByRole('button', { name: /Развернуть категорию/ }))
    await user.click(screen.getByRole('checkbox', { name: 'Фотография' }))
    await user.click(screen.getByRole('checkbox', { name: 'Рисование' }))
    expect(screen.getByRole('checkbox', { name: category.title })).toBeChecked()
    await user.click(screen.getByRole('checkbox', { name: 'Рисование' }))
    expect(screen.getByRole('checkbox', { name: category.title })).toBePartiallyChecked()
  })

  it('сохраняет выбор после сворачивания подкатегорий', async () => {
    const user = userEvent.setup()
    render(<SkillsFilter categories={[category]} />)
    await user.click(screen.getByRole('button', { name: /Развернуть категорию/ }))
    await user.click(screen.getByRole('checkbox', { name: 'Фотография' }))
    await user.click(screen.getByRole('button', { name: /Свернуть категорию/ }))
    await user.click(screen.getByRole('button', { name: /Развернуть категорию/ }))
    expect(screen.getByRole('checkbox', { name: 'Фотография' })).toBeChecked()
  })

  it('раскрывает и сворачивает оставшиеся категории', async () => {
    const user = userEvent.setup()
    const categories = Array.from({ length: CATALOG.CATEGORIES_VISIBLE + 1 }, (_, index) => ({
      ...category,
      id: `category-${index}`,
      title: `Категория ${index}`,
      subcategories: [],
    }))
    render(<SkillsFilter categories={categories} />)
    const lastName = categories.at(-1)!.title
    expect(screen.queryByRole('checkbox', { name: lastName })).not.toBeInTheDocument()
    await user.click(screen.getByRole('button', { name: 'Все категории' }))
    expect(screen.getByRole('checkbox', { name: lastName })).toBeInTheDocument()
    await user.click(screen.getByRole('button', { name: 'Свернуть категории' }))
    expect(screen.queryByRole('checkbox', { name: lastName })).not.toBeInTheDocument()
  })

  it('пересчитывает выбор при обновлении справочника', async () => {
    const user = userEvent.setup()
    const { rerender } = render(<SkillsFilter categories={[category]} />)
    await user.click(screen.getByRole('checkbox', { name: category.title }))
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
    expect(screen.getByRole('checkbox', { name: category.title })).toBePartiallyChecked()
  })

  it('выбор одной категории не меняет другую', async () => {
    const user = userEvent.setup()
    const other: Category = {
      ...category,
      id: 'languages',
      title: 'Языки',
      subcategories: [{ id: 'english', categoryId: 'languages', title: 'Английский' }],
    }
    render(<SkillsFilter categories={[category, other]} />)
    await user.click(screen.getByRole('checkbox', { name: other.title }))
    await user.click(screen.getByRole('checkbox', { name: category.title }))
    await user.click(screen.getByRole('checkbox', { name: category.title }))
    expect(screen.getByRole('checkbox', { name: other.title })).toBeChecked()
    expect(screen.getByRole('checkbox', { name: category.title })).not.toBeChecked()
  })

  it('сохраняет выбор и раскрытие скрытой категории после «Свернуть категории»', async () => {
    const user = userEvent.setup()
    const categories = [
      ...Array.from({ length: CATALOG.CATEGORIES_VISIBLE }, (_, index) => ({
        ...category,
        id: `empty-${index}`,
        title: `Пустая ${index}`,
        subcategories: [],
      })),
      category,
    ]
    render(<SkillsFilter categories={categories} />)
    await user.click(screen.getByRole('button', { name: 'Все категории' }))
    await user.click(screen.getByRole('button', { name: /Развернуть категорию/ }))
    await user.click(screen.getByRole('checkbox', { name: 'Фотография' }))
    await user.click(screen.getByRole('button', { name: 'Свернуть категории' }))
    await user.click(screen.getByRole('button', { name: 'Все категории' }))
    expect(screen.getByRole('checkbox', { name: 'Фотография' })).toBeChecked()
  })

  it('не предлагает выбирать или раскрывать категорию без подкатегорий', () => {
    render(<SkillsFilter categories={[{ ...category, subcategories: [] }]} />)
    expect(screen.getByRole('checkbox', { name: category.title })).toBeDisabled()
    expect(screen.queryByRole('button')).not.toBeInTheDocument()
  })
})
