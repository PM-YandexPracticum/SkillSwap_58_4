import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { useState } from 'react'

import { createCategory } from '../testing'
import {
  CategorySubcategorySelect,
  type CategorySubcategorySelectProps,
} from './CategorySubcategorySelect'

const category = createCategory()
const otherCategory = createCategory({
  id: 'creativity',
  title: 'Творчество и искусство',
  icon: 'creativity',
  color: 'creativity',
  subcategories: [
    { id: 'creativity-drawing', categoryId: 'creativity', title: 'Рисование и иллюстрация' },
    { id: 'creativity-photo', categoryId: 'creativity', title: 'Фотография' },
  ],
})

const props: CategorySubcategorySelectProps = {
  mode: 'multiple',
  categories: [category],
  categoryLabel: 'Категории',
  subcategoryLabel: 'Подкатегории',
  value: { categoryIds: [], subcategoryIds: [] },
  onChange: vi.fn(),
}

function ControlledSelect(selectionProps: CategorySubcategorySelectProps) {
  const [value, setValue] = useState(selectionProps.value)
  return (
    <CategorySubcategorySelect
      {...selectionProps}
      value={value}
      onChange={(next) => {
        selectionProps.onChange(next)
        setValue(next)
      }}
    />
  )
}

// Прокрутку активного пункта Select проверяем в браузере: jsdom её не реализует.
beforeAll(() => {
  Object.defineProperty(Element.prototype, 'scrollIntoView', { configurable: true, value: vi.fn() })
})
afterAll(() => {
  Reflect.deleteProperty(Element.prototype, 'scrollIntoView')
})

describe('CategorySubcategorySelect', () => {
  it('рендерится без Redux-провайдера и не меняет чужую часть выбора', async () => {
    const onChange = vi.fn()
    const value = { categoryIds: [], subcategoryIds: [category.subcategories[0].id] }
    const user = userEvent.setup()
    render(<CategorySubcategorySelect {...props} value={value} onChange={onChange} />)
    await user.click(screen.getByRole('button', { name: /^Категории/ }))
    await user.click(screen.getByRole('checkbox', { name: category.title }))
    expect(onChange).toHaveBeenCalledWith({
      categoryIds: [category.id],
      subcategoryIds: value.subcategoryIds,
    })
    expect(value.categoryIds).toEqual([])
  })

  it('позволяет выбрать несколько подкатегорий и снять выбор', async () => {
    const user = userEvent.setup()
    render(<ControlledSelect {...props} onChange={vi.fn()} />)
    await user.click(screen.getByRole('button', { name: /^Подкатегории/ }))
    await user.click(screen.getByRole('checkbox', { name: 'Управление командой' }))
    await user.click(screen.getByRole('checkbox', { name: 'Маркетинг и реклама' }))
    expect(screen.getByRole('button', { name: /^Подкатегории/ })).toHaveTextContent('+1')
    await user.click(screen.getByRole('checkbox', { name: 'Управление командой' }))
    expect(screen.getByRole('checkbox', { name: 'Управление командой' })).not.toBeChecked()
    expect(screen.getByRole('checkbox', { name: 'Маркетинг и реклама' })).toBeChecked()
  })

  it('без справочника не раскрывает пустые списки', async () => {
    const user = userEvent.setup()
    render(<CategorySubcategorySelect {...props} categories={[]} />)
    await user.click(screen.getByRole('button', { name: /^Категории/ }))
    expect(screen.getByRole('button', { name: /^Категории/ })).toHaveAttribute(
      'aria-expanded',
      'false',
    )
    expect(screen.queryByRole('checkbox')).not.toBeInTheDocument()
  })

  it('показывает все подкатегории, когда категории не выбраны', async () => {
    const user = userEvent.setup()
    render(<CategorySubcategorySelect {...props} categories={[category, otherCategory]} />)
    await user.click(screen.getByRole('button', { name: /^Подкатегории/ }))

    expect(screen.getByRole('checkbox', { name: 'Управление командой' })).toBeInTheDocument()
    expect(screen.getByRole('checkbox', { name: 'Рисование и иллюстрация' })).toBeInTheDocument()
  })

  it('показывает подкатегории только выбранных категорий', async () => {
    const user = userEvent.setup()
    render(
      <CategorySubcategorySelect
        {...props}
        categories={[category, otherCategory]}
        value={{ categoryIds: [category.id], subcategoryIds: [] }}
      />,
    )
    await user.click(screen.getByRole('button', { name: /^Подкатегории/ }))

    expect(screen.getByRole('checkbox', { name: 'Управление командой' })).toBeInTheDocument()
    expect(
      screen.queryByRole('checkbox', { name: 'Рисование и иллюстрация' }),
    ).not.toBeInTheDocument()
  })

  it('выбор подкатегории отмечает её категорию', async () => {
    const onChange = vi.fn()
    const user = userEvent.setup()
    render(<CategorySubcategorySelect {...props} onChange={onChange} />)
    await user.click(screen.getByRole('button', { name: /^Подкатегории/ }))
    await user.click(screen.getByRole('checkbox', { name: 'Управление командой' }))

    expect(onChange).toHaveBeenCalledWith({
      categoryIds: [category.id],
      subcategoryIds: [category.subcategories[0].id],
    })
  })

  it('снятие категории очищает её подкатегории и сохраняет остальные', async () => {
    const onChange = vi.fn()
    const user = userEvent.setup()
    render(
      <ControlledSelect
        {...props}
        categories={[category, otherCategory]}
        value={{
          categoryIds: [category.id, otherCategory.id],
          subcategoryIds: [category.subcategories[0].id, otherCategory.subcategories[0].id],
        }}
        onChange={onChange}
      />,
    )
    await user.click(screen.getByRole('button', { name: /^Категории/ }))
    await user.click(screen.getByRole('checkbox', { name: category.title }))

    expect(onChange).toHaveBeenLastCalledWith({
      categoryIds: [otherCategory.id],
      subcategoryIds: [otherCategory.subcategories[0].id],
    })
    expect(screen.getByRole('button', { name: /^Подкатегории/ })).toHaveTextContent(
      otherCategory.subcategories[0].title,
    )
  })

  it('single: выбор подкатегории автоматически выбирает категорию', async () => {
    const onChange = vi.fn()
    const user = userEvent.setup()
    render(
      <ControlledSelect
        {...props}
        mode="single"
        categories={[category, otherCategory]}
        onChange={onChange}
      />,
    )
    await user.click(screen.getByRole('combobox', { name: 'Подкатегории' }))
    await user.click(screen.getByRole('option', { name: 'Фотография' }))

    expect(onChange).toHaveBeenLastCalledWith({
      categoryIds: [otherCategory.id],
      subcategoryIds: [otherCategory.subcategories[1].id],
    })
    expect(screen.getByRole('combobox', { name: 'Категории' })).toHaveTextContent(
      otherCategory.title,
    )
    expect(screen.getByRole('combobox', { name: 'Подкатегории' })).toHaveFocus()
  })

  it('single: смена категории очищает прежнюю подкатегорию и фильтрует варианты', async () => {
    const onChange = vi.fn()
    const user = userEvent.setup()
    render(
      <ControlledSelect
        {...props}
        mode="single"
        categories={[category, otherCategory]}
        value={{
          categoryIds: [category.id],
          subcategoryIds: [category.subcategories[0].id],
        }}
        onChange={onChange}
      />,
    )
    await user.click(screen.getByRole('combobox', { name: 'Категории' }))
    await user.click(screen.getByRole('option', { name: otherCategory.title }))

    expect(onChange).toHaveBeenLastCalledWith({
      categoryIds: [otherCategory.id],
      subcategoryIds: [],
    })
    expect(screen.getByRole('combobox', { name: 'Подкатегории' })).toHaveTextContent(
      'Выберите подкатегорию',
    )
    await user.click(screen.getByRole('combobox', { name: 'Подкатегории' }))
    expect(screen.getByRole('option', { name: 'Фотография' })).toBeInTheDocument()
    expect(screen.queryByRole('option', { name: 'Управление командой' })).not.toBeInTheDocument()
  })

  it('обновляет списки после загрузки справочника, сохраняя управляемое значение', () => {
    const onChange = vi.fn()
    const selectionProps = {
      ...props,
      value: { categoryIds: [category.id], subcategoryIds: [category.subcategories[0].id] },
      onChange,
    }
    const { rerender } = render(<CategorySubcategorySelect {...selectionProps} categories={[]} />)
    rerender(<CategorySubcategorySelect {...selectionProps} categories={[category]} />)

    expect(screen.getByRole('button', { name: /^Категории/ })).toHaveTextContent(category.title)
    expect(screen.getByRole('button', { name: /^Подкатегории/ })).toHaveTextContent(
      category.subcategories[0].title,
    )
    expect(onChange).not.toHaveBeenCalled()
  })

  it('при следующем выборе удаляет скрытые id из загруженного справочника', async () => {
    const onChange = vi.fn()
    const user = userEvent.setup()
    render(
      <CategorySubcategorySelect
        {...props}
        value={{ categoryIds: [], subcategoryIds: ['removed-subcategory'] }}
        onChange={onChange}
      />,
    )
    await user.click(screen.getByRole('button', { name: /^Категории/ }))
    await user.click(screen.getByRole('checkbox', { name: category.title }))

    expect(onChange).toHaveBeenCalledWith({ categoryIds: [category.id], subcategoryIds: [] })
  })

  it('позволяет выбрать подкатегорию, если сохранённая категория больше не существует', async () => {
    const onChange = vi.fn()
    const user = userEvent.setup()
    render(
      <CategorySubcategorySelect
        {...props}
        value={{ categoryIds: ['removed-category'], subcategoryIds: [] }}
        onChange={onChange}
      />,
    )
    expect(onChange).not.toHaveBeenCalled()
    await user.click(screen.getByRole('button', { name: /^Подкатегории/ }))
    await user.click(screen.getByRole('checkbox', { name: category.subcategories[0].title }))

    expect(onChange).toHaveBeenCalledWith({
      categoryIds: [category.id],
      subcategoryIds: [category.subcategories[0].id],
    })
  })
})
