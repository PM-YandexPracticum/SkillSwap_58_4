import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { useState } from 'react'

import { createCategory } from '../testing'
import {
  CategorySubcategorySelect,
  type CategorySubcategorySelectProps,
} from './CategorySubcategorySelect'

const category = createCategory()
const props: CategorySubcategorySelectProps = {
  mode: 'multiple',
  categories: [category],
  categoryLabel: 'Категории',
  subcategoryLabel: 'Подкатегории',
  value: { categoryIds: [], subcategoryIds: [] },
  onChange: vi.fn(),
}

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
    function Example() {
      const [value, setValue] = useState(props.value)
      return <CategorySubcategorySelect {...props} value={value} onChange={setValue} />
    }
    const user = userEvent.setup()
    render(<Example />)
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
})
