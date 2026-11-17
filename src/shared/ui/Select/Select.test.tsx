import { createRef } from 'react'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { useState } from 'react'

import { Select, type SelectProps } from './Select'

const genders = [
  { value: null, label: 'Не указан' },
  { value: 'male', label: 'Мужской' },
  { value: 'female', label: 'Женский' },
]
const cities = [
  { value: 'spb', label: 'Санкт-Петербург' },
  { value: 'samara', label: 'Самара' },
  { value: 'saratov', label: 'Саратов' },
  { value: 'moscow', label: 'Москва' },
]

function ControlledSelect(props: SelectProps) {
  const [value, setValue] = useState(props.value)
  return (
    <Select
      {...props}
      value={value}
      onChange={(next) => {
        props.onChange(next)
        setValue(next)
      }}
    />
  )
}

// jsdom не реализует прокрутку; видимость активного пункта проверяется в браузере.
beforeAll(() => {
  Object.defineProperty(Element.prototype, 'scrollIntoView', { configurable: true, value: vi.fn() })
})
afterAll(() => {
  Reflect.deleteProperty(Element.prototype, 'scrollIntoView')
})

describe('Select', () => {
  it('показывает выбранное значение и отмечает его в списке', async () => {
    const user = userEvent.setup()
    render(<Select label="Пол" options={genders} value="male" onChange={vi.fn()} />)
    const field = screen.getByRole('combobox', { name: 'Пол' })
    expect(field).toHaveTextContent('Мужской')
    await user.click(field)
    expect(screen.getByRole('option', { name: 'Мужской' })).toHaveAttribute('aria-selected', 'true')
  })

  it('выбирает вариант мышью и возвращает фокус на поле', async () => {
    const user = userEvent.setup()
    const onChange = vi.fn()
    render(<ControlledSelect label="Пол" options={genders} value={null} onChange={onChange} />)
    const field = screen.getByRole('combobox', { name: 'Пол' })
    await user.click(field)
    await user.click(screen.getByRole('option', { name: 'Женский' }))
    expect(onChange).toHaveBeenCalledWith('female')
    expect(field).toHaveTextContent('Женский')
    expect(field).toHaveFocus()
    expect(screen.queryByRole('listbox')).not.toBeInTheDocument()
  })

  it('передаёт null при выборе «Не указан»', async () => {
    const user = userEvent.setup()
    const onChange = vi.fn()
    render(<ControlledSelect label="Пол" options={genders} value="male" onChange={onChange} />)
    await user.click(screen.getByRole('combobox'))
    await user.click(screen.getByRole('option', { name: 'Не указан' }))
    expect(onChange).toHaveBeenCalledWith(null)
    expect(screen.getByRole('combobox')).toHaveTextContent('Не указан')
  })

  it.each(['{Enter}', '{ArrowDown}', ' '])('открывает поле с клавиатуры: %s', async (key) => {
    const user = userEvent.setup()
    render(<Select label="Пол" options={genders} value={null} onChange={vi.fn()} />)
    await user.tab()
    await user.keyboard(key)
    expect(screen.getByRole('listbox', { name: 'Пол' })).toBeInTheDocument()
  })

  it('выбирает стрелками и Enter, не выходя за границы списка', async () => {
    const user = userEvent.setup()
    const onChange = vi.fn()
    render(<Select label="Пол" options={genders} value={null} onChange={onChange} />)
    await user.tab()
    await user.keyboard('{ArrowDown}{ArrowUp}{ArrowDown}{ArrowDown}{ArrowDown}{Enter}')
    expect(onChange).toHaveBeenCalledWith('female')
  })

  it('открывается на выбранном пункте', async () => {
    const user = userEvent.setup()
    render(<Select options={genders} value="female" onChange={vi.fn()} />)
    await user.tab()
    await user.keyboard('{ArrowDown}')
    expect(screen.getByRole('combobox')).toHaveAttribute(
      'aria-activedescendant',
      screen.getByRole('option', { name: 'Женский' }).id,
    )
  })

  it('открывает последний пункт стрелкой вверх без выбранного значения', async () => {
    const user = userEvent.setup()
    const onChange = vi.fn()
    render(<Select options={cities} value={null} onChange={onChange} />)
    await user.tab()
    await user.keyboard('{ArrowUp}{Enter}')
    expect(onChange).toHaveBeenCalledWith('moscow')
  })

  it.each([false, true])(
    'закрывается по Escape без изменения значения (searchable=%s)',
    async (searchable) => {
      const user = userEvent.setup()
      const onChange = vi.fn()
      render(
        <Select
          label="Город"
          options={cities}
          value="samara"
          onChange={onChange}
          searchable={searchable}
        />,
      )
      const field = screen.getByRole('combobox')
      await user.click(field)
      await user.keyboard('{Escape}')
      expect(screen.queryByRole('listbox')).not.toBeInTheDocument()
      expect(field).toHaveFocus()
      expect(onChange).not.toHaveBeenCalled()
      if (searchable) expect(field).toHaveValue('Самара')
    },
  )

  it('закрывается по Tab и переводит фокус на следующее поле', async () => {
    const user = userEvent.setup()
    render(
      <>
        <Select options={genders} value={null} onChange={vi.fn()} />
        <button type="button">Далее</button>
      </>,
    )
    await user.tab()
    await user.keyboard('{Enter}')
    await user.tab()
    expect(screen.queryByRole('listbox')).not.toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Далее' })).toHaveFocus()
  })

  it('закрывается по клику вне и при уходе фокуса', async () => {
    const user = userEvent.setup()
    render(
      <>
        <Select options={genders} value={null} onChange={vi.fn()} />
        <button type="button">Снаружи</button>
      </>,
    )
    await user.click(screen.getByRole('combobox'))
    await user.click(screen.getByRole('button', { name: 'Снаружи' }))
    expect(screen.queryByRole('listbox')).not.toBeInTheDocument()
    await user.click(screen.getByRole('combobox'))
    await user.tab({ shift: true })
    expect(screen.queryByRole('listbox')).not.toBeInTheDocument()
  })

  it('фильтрует города без учёта регистра и пробелов по краям', async () => {
    const user = userEvent.setup()
    render(<Select label="Город" options={cities} value={null} onChange={vi.fn()} searchable />)
    await user.type(screen.getByRole('combobox'), ' сА ')
    expect(screen.getAllByRole('option')).toHaveLength(3)
    expect(screen.queryByRole('option', { name: 'Москва' })).not.toBeInTheDocument()
  })

  it('выбирает найденный город с клавиатуры', async () => {
    const user = userEvent.setup()
    const onChange = vi.fn()
    render(
      <ControlledSelect
        label="Город"
        options={cities}
        value={null}
        onChange={onChange}
        searchable
      />,
    )
    const field = screen.getByRole('combobox')
    await user.type(field, 'Са')
    await user.keyboard('{ArrowDown}{Enter}')
    expect(field).toHaveValue('Самара')
    expect(onChange).toHaveBeenCalledWith('samara')
    expect(screen.queryByRole('listbox')).not.toBeInTheDocument()
  })

  it('очищает запрос и выбранный город кнопкой справа', async () => {
    const user = userEvent.setup()
    const onChange = vi.fn()
    render(
      <ControlledSelect
        label="Город"
        options={cities}
        value="samara"
        onChange={onChange}
        searchable
      />,
    )
    await user.click(screen.getByRole('button', { name: 'Очистить' }))
    expect(screen.getByRole('combobox')).toHaveValue('')
    expect(screen.getByRole('combobox')).toHaveFocus()
    expect(onChange).toHaveBeenCalledWith(null)
    expect(screen.getAllByRole('option')).toHaveLength(cities.length)
  })

  it('не выбирает несуществующий город при отсутствии результатов', async () => {
    const user = userEvent.setup()
    const onChange = vi.fn()
    render(<Select options={cities} value={null} onChange={onChange} searchable />)
    const field = screen.getByRole('combobox')
    await user.type(field, 'Казань')
    await user.keyboard('{ArrowDown}{ArrowUp}{Enter}')
    expect(screen.queryByRole('option')).not.toBeInTheDocument()
    expect(field).not.toHaveAttribute('aria-activedescendant')
    expect(onChange).not.toHaveBeenCalled()
  })

  it.each([false, true])(
    'disabled не открывается и не меняет значение (searchable=%s)',
    async (searchable) => {
      const user = userEvent.setup()
      const onChange = vi.fn()
      render(
        <Select
          label="Город"
          options={cities}
          value="samara"
          onChange={onChange}
          searchable={searchable}
          disabled
          defaultOpen
        />,
      )
      const field = screen.getByRole('combobox')
      expect(field).toBeDisabled()
      expect(screen.queryByRole('button', { name: 'Очистить' })).not.toBeInTheDocument()
      await user.click(field)
      expect(screen.queryByRole('listbox')).not.toBeInTheDocument()
      expect(onChange).not.toHaveBeenCalled()
    },
  )

  it('закрывает открытый список при переключении disabled', async () => {
    const user = userEvent.setup()
    const props = { options: cities, value: null, onChange: vi.fn(), searchable: true }
    const { rerender } = render(<Select {...props} />)
    await user.click(screen.getByRole('combobox'))
    rerender(<Select {...props} disabled />)
    expect(screen.queryByRole('listbox')).not.toBeInTheDocument()
    rerender(<Select {...props} />)
    expect(screen.queryByRole('listbox')).not.toBeInTheDocument()
  })

  it.each([false, true])('связывает сообщение ошибки с полем (searchable=%s)', (searchable) => {
    render(
      <Select
        label="Пол"
        options={genders}
        value={null}
        onChange={vi.fn()}
        error="Обязательное поле"
        searchable={searchable}
      />,
    )
    expect(screen.getByRole('combobox')).toHaveAttribute('aria-invalid', 'true')
    expect(screen.getByRole('combobox')).toHaveAccessibleDescription('Обязательное поле')
  })

  it('не оставляет ссылку на исчезнувший активный пункт при замене вариантов', async () => {
    const user = userEvent.setup()
    const onChange = vi.fn()
    const { rerender } = render(<Select options={genders} value="female" onChange={onChange} />)
    await user.click(screen.getByRole('combobox'))
    rerender(<Select options={cities.slice(0, 2)} value={null} onChange={onChange} />)
    expect(screen.getByRole('combobox')).not.toHaveAttribute('aria-activedescendant')
    await user.keyboard('{Enter}')
    expect(onChange).not.toHaveBeenCalled()
    await user.keyboard('{ArrowDown}{Enter}')
    expect(onChange).toHaveBeenCalledWith('spb')
  })

  it('не открывает пустой обычный список', async () => {
    const user = userEvent.setup()
    render(<Select options={[]} value={null} onChange={vi.fn()} />)
    await user.click(screen.getByRole('combobox'))
    await user.keyboard('{ArrowDown}{Enter}')
    expect(screen.queryByRole('listbox')).not.toBeInTheDocument()
  })

  it('показывает обновлённое выбранное значение из пропсов', () => {
    const props = { options: cities, onChange: vi.fn(), searchable: true }
    const { rerender } = render(<Select {...props} value="samara" />)
    rerender(<Select {...props} value="spb" />)
    expect(screen.getByRole('combobox')).toHaveValue('Санкт-Петербург')
  })
  it.each([false, true])(
    'сообщает о blur при уходе из всего поля; ref фокусирует поле (searchable=%s)',
    async (searchable) => {
      const ref = createRef<HTMLInputElement | HTMLButtonElement>()
      const onBlur = vi.fn()
      const user = userEvent.setup()
      render(
        <>
          <Select
            ref={ref}
            label="Город"
            options={cities}
            value="samara"
            onChange={vi.fn()}
            onBlur={onBlur}
            searchable={searchable}
          />
          <button onClick={() => ref.current?.focus()}>Вернуться к полю</button>
        </>,
      )
      await user.click(screen.getByRole('combobox'))
      if (searchable) {
        await user.type(screen.getByRole('combobox'), 'са')
        await user.click(screen.getByRole('button', { name: 'Очистить' }))
        expect(onBlur).not.toHaveBeenCalled()
      }
      await user.click(screen.getByRole('button', { name: 'Вернуться к полю' }))
      expect(onBlur).toHaveBeenCalledOnce()
      expect(screen.getByRole('combobox')).toHaveFocus()
    },
  )
})
