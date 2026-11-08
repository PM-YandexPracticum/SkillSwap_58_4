import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { useState, type FormEvent } from 'react'

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

  it.each([
    ['удалении активного пункта', options.slice(1), true],
    ['очистке списка', [], false],
  ])('возвращает фокус на поле при %s', async (_, nextOptions, expanded) => {
    const user = userEvent.setup()
    const onChange = vi.fn()
    const props = { label: 'Категории', options, value: [], onChange }
    const { rerender } = render(<MultiSelect {...props} />)

    await user.tab()
    await user.keyboard('{ArrowDown}')
    expect(checkbox('Бизнес и карьера')).toHaveFocus()

    rerender(<MultiSelect {...props} options={nextOptions} />)

    expect(field()).toHaveFocus()
    expect(field()).toHaveAttribute('aria-expanded', String(expanded))
    expect(onChange).not.toHaveBeenCalled()
    if (expanded) {
      await user.keyboard('{ArrowDown}')
      expect(checkbox('Творчество и искусство')).toHaveFocus()
    }
  })

  it('сохраняет фокус на существующем пункте при перестановке вариантов', async () => {
    const user = userEvent.setup()
    const props = { label: 'Категории', options, value: [], onChange: vi.fn() }
    const { rerender } = render(<MultiSelect {...props} />)

    await user.tab()
    await user.keyboard('{ArrowDown}')
    rerender(<MultiSelect {...props} options={[options[1], options[0]]} />)

    expect(checkbox('Бизнес и карьера')).toHaveFocus()
    expect(field()).toHaveAttribute('aria-expanded', 'true')
  })

  it('обновляет отметки и подпись при внешней смене и сбросе значения', async () => {
    const user = userEvent.setup()
    const props = { label: 'Категории', options, value: ['business'], onChange: vi.fn() }
    const { rerender } = render(<MultiSelect {...props} />)
    await user.click(field())

    rerender(<MultiSelect {...props} value={['art', 'languages']} />)
    expect(field()).toHaveAccessibleName('Категории Творчество и искусство +1')
    expect(checkbox('Бизнес и карьера')).not.toBeChecked()
    expect(checkbox('Творчество и искусство')).toBeChecked()
    expect(checkbox('Иностранные языки')).toBeChecked()

    rerender(<MultiSelect {...props} value={[]} />)
    expect(field()).toHaveAccessibleName('Категории Выберите значения')
    expect(screen.getAllByRole('checkbox', { checked: false })).toHaveLength(options.length)
    expect(props.onChange).not.toHaveBeenCalled()
  })

  it('закрывается при disabled и не открывается сам после включения', async () => {
    const user = userEvent.setup()
    const props = { label: 'Категории', options, value: [], onChange: vi.fn() }
    const { rerender } = render(<MultiSelect {...props} />)
    await user.tab()
    await user.keyboard('{ArrowDown}')

    rerender(<MultiSelect {...props} disabled />)
    expect(field()).toBeDisabled()
    expect(screen.queryByRole('checkbox')).not.toBeInTheDocument()

    rerender(<MultiSelect {...props} />)
    expect(field()).toHaveAttribute('aria-expanded', 'false')
    await user.click(field())
    expect(checkbox('Бизнес и карьера')).toBeInTheDocument()
    expect(props.onChange).not.toHaveBeenCalled()
  })

  it('не открывает пустой список, даже с defaultOpen, и принимает новые варианты', async () => {
    const user = userEvent.setup()
    const props = { label: 'Категории', value: [], onChange: vi.fn(), defaultOpen: true }
    const { rerender } = render(<MultiSelect {...props} options={[]} />)
    await user.click(field())
    await user.keyboard('{ArrowDown}{ArrowUp}')
    expect(field()).toHaveAttribute('aria-expanded', 'false')

    rerender(<MultiSelect {...props} options={options} />)
    expect(field()).toHaveAttribute('aria-expanded', 'false')
    await user.keyboard('{ArrowUp}')
    expect(checkbox('Иностранные языки')).toHaveFocus()
  })

  it('оставляет фокус на внешней кнопке после закрытия и обновления списка', async () => {
    const user = userEvent.setup()
    const props = { label: 'Категории', value: [], onChange: vi.fn() }
    const renderForm = (nextOptions: MultiSelectProps['options']) => (
      <>
        <MultiSelect {...props} options={nextOptions} />
        <button type="button">Далее</button>
      </>
    )
    const { rerender } = render(renderForm(options))
    await user.tab()
    await user.keyboard('{ArrowDown}')
    await user.click(screen.getByRole('button', { name: 'Далее' }))
    rerender(renderForm(options.slice(1)))

    expect(screen.getByRole('button', { name: 'Далее' })).toHaveFocus()
    expect(field()).toHaveAttribute('aria-expanded', 'false')
  })

  it('переключает чекбокс по Enter без отправки формы', async () => {
    const user = userEvent.setup()
    const onSubmit = vi.fn((event: FormEvent) => event.preventDefault())
    render(
      <form onSubmit={onSubmit}>
        <ControlledMultiSelect label="Категории" options={options} value={[]} onChange={vi.fn()} />
        <button type="submit">Далее</button>
      </form>,
    )

    await user.tab()
    await user.keyboard('{Enter}{ArrowDown}{Enter}')
    expect(checkbox('Бизнес и карьера')).toBeChecked()
    expect(checkbox('Бизнес и карьера')).toHaveFocus()
    expect(field()).toHaveAttribute('aria-expanded', 'true')
    expect(onSubmit).not.toHaveBeenCalled()
  })
})
