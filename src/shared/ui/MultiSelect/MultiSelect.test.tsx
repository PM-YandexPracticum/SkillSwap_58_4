import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { useState } from 'react'

import { MultiSelect, type MultiSelectProps } from './MultiSelect'

const options = [
  { value: 'business', label: 'Бизнес и карьера' },
  { value: 'art', label: 'Творчество и искусство' },
  { value: 'languages', label: 'Иностранные языки' },
]

function ControlledMultiSelect(props: MultiSelectProps) {
  const [value, setValue] = useState(props.value)

  return (
    <MultiSelect
      {...props}
      value={value}
      onChange={(next) => {
        props.onChange(next)
        setValue(next)
      }}
    />
  )
}

const field = () => screen.getByRole('button', { name: /^Категории/ })
const checkbox = (name: string) => screen.getByRole('checkbox', { name })

describe('MultiSelect', () => {
  it('показывает первое выбранное название и счётчик остальных в закрытом поле', () => {
    render(
      <MultiSelect
        label="Категории"
        options={options}
        value={['art', 'business', 'languages']}
        onChange={vi.fn()}
      />,
    )

    expect(field()).toHaveAccessibleName('Категории Творчество и искусство +2')
    expect(screen.queryByRole('checkbox')).not.toBeInTheDocument()
  })

  it('отмечает несколько пунктов и снимает один из них, оставляя список открытым', async () => {
    const user = userEvent.setup()
    const onChange = vi.fn()
    const value = Object.freeze(['business'])
    render(
      <ControlledMultiSelect
        label="Категории"
        options={options}
        value={value}
        onChange={onChange}
      />,
    )

    await user.click(field())
    expect(checkbox('Бизнес и карьера')).toBeChecked()
    await user.click(checkbox('Творчество и искусство'))
    expect(onChange).toHaveBeenLastCalledWith(['business', 'art'])
    expect(checkbox('Творчество и искусство')).toBeChecked()
    await user.click(checkbox('Бизнес и карьера'))
    expect(onChange).toHaveBeenLastCalledWith(['art'])
    expect(checkbox('Бизнес и карьера')).not.toBeChecked()
    expect(field()).toHaveAttribute('aria-expanded', 'true')
    expect(field()).toHaveTextContent('Творчество и искусство')
  })

  it('открывается с клавиатуры, переключает пункты и возвращает фокус по Escape', async () => {
    const user = userEvent.setup()
    render(
      <ControlledMultiSelect label="Категории" options={options} value={[]} onChange={vi.fn()} />,
    )

    await user.tab()
    await user.keyboard('{ArrowDown}')
    expect(checkbox('Бизнес и карьера')).toHaveFocus()
    await user.keyboard('{ArrowDown} ')
    expect(checkbox('Творчество и искусство')).toBeChecked()
    await user.keyboard('{Escape}')
    expect(field()).toHaveFocus()
    expect(screen.queryByRole('checkbox')).not.toBeInTheDocument()
    expect(field()).toHaveTextContent('Творчество и искусство')
  })

  it('закрывается по клику снаружи или при уходе фокуса из списка', async () => {
    const user = userEvent.setup()
    render(
      <>
        <MultiSelect label="Категории" options={options} value={[]} onChange={vi.fn()} />
        <button type="button">Далее</button>
      </>,
    )

    await user.click(field())
    await user.click(screen.getByText('Далее'))
    expect(field()).toHaveAttribute('aria-expanded', 'false')
    await user.click(field())
    await user.tab()
    expect(checkbox('Бизнес и карьера')).toHaveFocus()
    await user.tab()
    await user.tab()
    await user.tab()
    expect(screen.getByRole('button', { name: 'Далее' })).toHaveFocus()
    expect(field()).toHaveAttribute('aria-expanded', 'false')
  })

  it('сообщает об ошибке и не открывается в disabled', async () => {
    const user = userEvent.setup()
    render(
      <MultiSelect
        label="Категории"
        options={options}
        value={[]}
        onChange={vi.fn()}
        error="Выберите категорию"
        disabled
      />,
    )

    expect(field()).toBeDisabled()
    expect(field()).toHaveAccessibleDescription('Выберите категорию')
    await user.click(field())
    expect(screen.queryByRole('checkbox')).not.toBeInTheDocument()
  })
})
