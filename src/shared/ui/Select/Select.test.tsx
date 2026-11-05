import { fireEvent, render, screen } from '@testing-library/react'

import { Select } from './Select'

const options = [
  { value: null, label: 'Не указан' },
  { value: 'male', label: 'Мужской' },
  { value: 'female', label: 'Женский' },
]

describe('Select', () => {
  it('показывает выбранный вариант и открывает список по клику', () => {
    render(
      <Select label="Пол" options={options} value="male" onChange={vi.fn()} />,
    )

    fireEvent.click(screen.getByRole('combobox', { name: 'Пол' }))

    expect(screen.getByRole('listbox')).toBeInTheDocument()
    expect(screen.getByRole('option', { name: 'Мужской' })).toHaveAttribute(
      'aria-selected',
      'true',
    )
  })

  it('выбирает вариант и передает null для «Не указан»', () => {
    const onChange = vi.fn()
    render(<Select label="Пол" options={options} value="male" onChange={onChange} />)
    fireEvent.click(screen.getByRole('combobox', { name: 'Пол' }))
    fireEvent.click(screen.getByRole('option', { name: 'Не указан' }))

    expect(onChange).toHaveBeenCalledWith(null)
    expect(screen.queryByRole('listbox')).not.toBeInTheDocument()
  })

  it('открывает список клавишей ArrowDown и выбирает стрелками и Enter', () => {
    const onChange = vi.fn()
    render(<Select label="Пол" options={options} value={null} onChange={onChange} />)
    const trigger = screen.getByRole('combobox', { name: 'Пол' })

    fireEvent.keyDown(trigger, { key: 'ArrowDown' })
    expect(trigger).toHaveAttribute(
      'aria-activedescendant',
      screen.getByRole('option', { name: 'Не указан' }).id,
    )

    fireEvent.keyDown(trigger, { key: 'ArrowDown' })
    expect(trigger).toHaveAttribute(
      'aria-activedescendant',
      screen.getByRole('option', { name: 'Мужской' }).id,
    )

    fireEvent.keyDown(trigger, { key: 'Enter' })
    expect(onChange).toHaveBeenCalledWith('male')
  })

  it('закрывается по Escape, оставляя фокус на поле', () => {
    render(<Select label="Пол" options={options} value={null} onChange={vi.fn()} />)
    const trigger = screen.getByRole('combobox', { name: 'Пол' })
    fireEvent.click(trigger)
    fireEvent.keyDown(trigger, { key: 'Escape' })

    expect(screen.queryByRole('listbox')).not.toBeInTheDocument()
    expect(trigger).toHaveFocus()
  })

  it('закрывается по Tab', () => {
    render(<Select label="Пол" options={options} value={null} onChange={vi.fn()} />)
    const trigger = screen.getByRole('combobox', { name: 'Пол' })

    fireEvent.click(trigger)
    fireEvent.keyDown(trigger, { key: 'Tab' })

    expect(screen.queryByRole('listbox')).not.toBeInTheDocument()
  })

  it('закрывается, когда фокус уходит с компонента', () => {
    render(
      <>
        <Select label="Пол" options={options} value={null} onChange={vi.fn()} />
        <button type="button">Снаружи</button>
      </>,
    )
    const trigger = screen.getByRole('combobox', { name: 'Пол' })

    fireEvent.click(trigger)
    fireEvent.blur(trigger, { relatedTarget: screen.getByRole('button', { name: 'Снаружи' }) })

    expect(screen.queryByRole('listbox')).not.toBeInTheDocument()
  })

  it('закрывается по клику вне списка', () => {
    render(
      <>
        <Select label="Пол" options={options} value={null} onChange={vi.fn()} />
        <button type="button">Снаружи</button>
      </>,
    )
    fireEvent.click(screen.getByRole('combobox', { name: 'Пол' }))
    fireEvent.mouseDown(screen.getByRole('button', { name: 'Снаружи' }))

    expect(screen.queryByRole('listbox')).not.toBeInTheDocument()
  })

  it('показывает ошибку и не открывается в disabled-состоянии', () => {
    render(
      <Select
        label="Пол"
        options={options}
        value={null}
        onChange={vi.fn()}
        error="Обязательное поле"
        disabled
      />,
    )

    const trigger = screen.getByRole('combobox', { name: 'Пол' })
    expect(trigger).toBeDisabled()
    expect(trigger).toHaveAttribute('aria-invalid', 'true')
    expect(screen.getByRole('alert')).toHaveTextContent('Обязательное поле')
    fireEvent.click(trigger)
    expect(screen.queryByRole('listbox')).not.toBeInTheDocument()
  })
})
