import { useState } from 'react'
import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Controller, useForm } from 'react-hook-form'
import { DatePicker, type DatePickerProps } from './DatePicker'

function Field({ onChange, ...props }: Partial<DatePickerProps>) {
  const [value, setValue] = useState<string | null>('2000-04-27')
  return (
    <DatePicker
      label="Дата рождения"
      value={value}
      onChange={(next) => {
        setValue(next)
        onChange?.(next)
      }}
      min="1999-12-31"
      max="2001-05-10"
      {...props}
    />
  )
}

const input = () => screen.getByRole('textbox', { name: 'Дата рождения' })
const calendarButton = () => screen.getByRole('button', { name: 'Открыть календарь' })
const day = (date: string) => screen.getByRole('gridcell', { name: new RegExp(`, ${date} г\\.`) })

describe('DatePicker', () => {
  it('подтверждает дату только по кнопке «Выбрать» и возвращает ISO без времени', async () => {
    const user = userEvent.setup()
    const onChange = vi.fn()
    render(<Field onChange={onChange} />)
    await user.click(calendarButton())
    await user.click(day('15 апреля 2000'))

    expect(onChange).not.toHaveBeenCalled()
    expect(input()).toHaveValue('27.04.2000')

    await user.click(screen.getByRole('button', { name: 'Выбрать' }))
    expect(onChange).toHaveBeenCalledWith('2000-04-15')
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
  })

  it('отбрасывает черновик при отмене и клике снаружи', async () => {
    const user = userEvent.setup()
    render(
      <>
        <Field />
        <button type="button">Снаружи</button>
      </>,
    )
    for (const closeLabel of ['Отменить', 'Снаружи']) {
      await user.click(calendarButton())
      await user.click(day('15 апреля 2000'))
      await user.click(screen.getByRole('button', { name: closeLabel }))
      expect(input()).toHaveValue('27.04.2000')
      expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
    }
    await user.click(calendarButton())
    expect(day('27 апреля 2000')).toHaveAttribute('aria-selected', 'true')
  })

  it('открывается клавиатурой, закрывается по Escape и возвращает фокус', async () => {
    const user = userEvent.setup()
    render(<Field />)
    await user.tab()
    await user.tab()
    expect(calendarButton()).toHaveFocus()
    await user.keyboard('{Enter}')
    expect(screen.getByRole('combobox', { name: 'Месяц' })).toHaveFocus()
    await user.keyboard('{Escape}')
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
    expect(input()).toHaveFocus()
  })

  it('показывает русскую неделю с понедельника и позволяет выбрать месяц и год', async () => {
    const user = userEvent.setup()
    render(<Field />)
    await user.click(calendarButton())
    const headers = within(screen.getByRole('dialog')).getAllByRole('columnheader')
    expect(headers[0]).toHaveTextContent(/пн/i)

    await user.selectOptions(screen.getByRole('combobox', { name: 'Год' }), '2001')
    await user.selectOptions(screen.getByRole('combobox', { name: 'Месяц' }), '4')
    expect(day('10 мая 2001')).toHaveAttribute('aria-disabled', 'false')
    expect(day('11 мая 2001')).toHaveAttribute('aria-disabled', 'true')
  })

  it('связывает ошибку формы с полем и блокирует открытие при disabled', () => {
    render(<Field disabled error="Укажите дату рождения" />)
    expect(input()).toBeDisabled()
    expect(input()).toHaveAccessibleDescription('Укажите дату рождения')
    expect(calendarButton()).toBeDisabled()
  })

  it('передаёт значение и ref в форму через Controller', async () => {
    const user = userEvent.setup()
    const onSubmit = vi.fn()
    function Form() {
      const { control, handleSubmit, setFocus } = useForm<{ birthDate: string | null }>({
        defaultValues: { birthDate: '2000-04-27' },
      })
      return (
        <form onSubmit={handleSubmit((data) => onSubmit(data))}>
          <Controller
            name="birthDate"
            control={control}
            render={({ field }) => <DatePicker {...field} label="Дата рождения" />}
          />
          <button type="button" onClick={() => setFocus('birthDate')}>
            Фокус
          </button>
          <button type="submit">Сохранить</button>
        </form>
      )
    }
    render(<Form />)
    await user.click(screen.getByRole('button', { name: 'Фокус' }))
    expect(input()).toHaveFocus()
    await user.click(calendarButton())
    await user.click(day('15 апреля 2000'))
    await user.click(screen.getByRole('button', { name: 'Выбрать' }))
    await user.click(screen.getByRole('button', { name: 'Сохранить' }))
    expect(onSubmit).toHaveBeenCalledWith({ birthDate: '2000-04-15' })
  })
})

describe('ручной ввод даты', () => {
  it('принимает дд.мм.гггг и показывает сброшенное извне значение', async () => {
    const user = userEvent.setup()
    const onChange = vi.fn()
    function Form() {
      const [value, setValue] = useState<string | null>(null)
      return (
        <>
          <DatePicker
            value={value}
            onChange={(date) => {
              setValue(date)
              onChange(date)
            }}
          />
          <button type="button" onClick={() => setValue(null)}>
            Сбросить
          </button>
        </>
      )
    }
    render(<Form />)
    await user.type(input(), '29.02.2000')
    expect(onChange).toHaveBeenLastCalledWith('2000-02-29')
    expect(input()).toHaveValue('29.02.2000')
    await user.click(screen.getByRole('button', { name: 'Сбросить' }))
    expect(input()).toHaveValue('')
  })

  it.each(['31.02.2000', '11.05.2001'])(
    'не передаёт в форму недопустимую дату %s',
    async (date) => {
      const user = userEvent.setup()
      const onChange = vi.fn()
      render(<Field onChange={onChange} />)
      await user.clear(input())
      await user.type(input(), date)
      await user.tab()
      expect(onChange).toHaveBeenCalledWith(null)
      expect(onChange.mock.calls.every(([value]) => value === null)).toBe(true)
      expect(input()).toHaveAttribute('aria-invalid', 'true')
    },
  )
})

describe('синхронизация с формой', () => {
  it.each([null, '2001-05-01'])(
    'отбрасывает старый черновик при внешнем value=%s',
    async (value) => {
      const user = userEvent.setup()
      const onChange = vi.fn()
      const { rerender } = render(<DatePicker value="2000-04-27" onChange={onChange} />)
      await user.click(calendarButton())
      await user.click(day('15 апреля 2000'))

      rerender(<DatePicker value={value} onChange={onChange} />)

      expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
      expect(input()).toHaveValue(value ? '01.05.2001' : '')
      expect(onChange).not.toHaveBeenCalled()
      await user.click(calendarButton())
      if (value) expect(day('1 мая 2001')).toHaveAttribute('aria-selected', 'true')
      else expect(screen.getByRole('button', { name: 'Выбрать' })).toBeDisabled()
    },
  )

  it('очищает некорректный текст по resetKey, даже если value уже null', async () => {
    const user = userEvent.setup()
    const onChange = vi.fn()
    const { rerender } = render(<DatePicker value={null} onChange={onChange} resetKey={0} />)
    await user.type(input(), '31.02.2000')
    await user.tab()
    expect(input()).toHaveAttribute('aria-invalid', 'true')

    rerender(<DatePicker value={null} onChange={onChange} resetKey={1} />)

    expect(input()).toHaveValue('')
    expect(input()).not.toHaveAttribute('aria-invalid', 'true')
    expect(onChange).not.toHaveBeenCalled()
  })

  it('вызывает onBlur один раз при клике из календаря в другое поле', async () => {
    const user = userEvent.setup()
    const onBlur = vi.fn()
    render(
      <>
        <DatePicker value={null} onChange={vi.fn()} onBlur={onBlur} />
        <input aria-label="Снаружи" />
      </>,
    )
    await user.click(calendarButton())
    expect(screen.getByRole('combobox', { name: 'Месяц' })).toHaveFocus()
    expect(onBlur).not.toHaveBeenCalled()

    await user.click(screen.getByRole('textbox', { name: 'Снаружи' }))

    expect(onBlur).toHaveBeenCalledTimes(1)
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
    expect(screen.getByRole('textbox', { name: 'Снаружи' })).toHaveFocus()
  })

  it('помечает Controller touched и запускает проверку onBlur после выхода из календаря', async () => {
    const user = userEvent.setup()
    function Form() {
      const { control } = useForm<{ birthDate: string | null }>({
        mode: 'onBlur',
        defaultValues: { birthDate: null },
      })
      return (
        <>
          <Controller
            name="birthDate"
            control={control}
            rules={{ required: 'Укажите дату рождения' }}
            render={({ field, fieldState }) => (
              <DatePicker {...field} error={fieldState.error?.message} />
            )}
          />
          <input aria-label="Снаружи" />
        </>
      )
    }
    render(<Form />)
    await user.click(calendarButton())
    await user.click(screen.getByRole('textbox', { name: 'Снаружи' }))
    expect(await screen.findByText('Укажите дату рождения')).toBeInTheDocument()
  })
})

describe('границы и клавиатура', () => {
  it('даёт выбрать день стрелками и Enter, сохраняя дату только после подтверждения', async () => {
    const user = userEvent.setup()
    const onChange = vi.fn()
    render(<Field onChange={onChange} />)
    input().focus()
    await user.keyboard('{ArrowDown}')
    await user.tab()
    await user.tab()
    await user.keyboard('{ArrowRight}{Enter}')
    expect(day('28 апреля 2000')).toHaveAttribute('aria-selected', 'true')
    expect(onChange).not.toHaveBeenCalled()
    await user.click(screen.getByRole('button', { name: 'Выбрать' }))
    expect(onChange).toHaveBeenLastCalledWith('2000-04-28')
  })

  it('ограничивает видимый месяц при выборе граничного года', async () => {
    const user = userEvent.setup()
    render(<DatePicker value="2001-04-27" onChange={vi.fn()} min="2000-06-10" max="2002-03-20" />)
    await user.click(calendarButton())
    await user.selectOptions(screen.getByRole('combobox', { name: 'Год' }), '2000')
    expect(screen.getByRole('combobox', { name: 'Месяц' })).toHaveValue('5')
    expect(day('9 июня 2000')).toHaveAttribute('aria-disabled', 'true')
    expect(day('10 июня 2000')).toHaveAttribute('aria-disabled', 'false')
    await user.selectOptions(screen.getByRole('combobox', { name: 'Год' }), '2002')
    expect(screen.getByRole('combobox', { name: 'Месяц' })).toHaveValue('2')
    expect(day('20 марта 2002')).toHaveAttribute('aria-disabled', 'false')
    expect(day('21 марта 2002')).toHaveAttribute('aria-disabled', 'true')
  })

  it('закрывает открытый календарь при disabled и не меняет значение', async () => {
    const user = userEvent.setup()
    const onChange = vi.fn()
    const { rerender } = render(<DatePicker value="2000-04-27" onChange={onChange} />)
    await user.click(calendarButton())
    rerender(<DatePicker value="2000-04-27" onChange={onChange} disabled />)
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
    expect(input()).toBeDisabled()
    expect(onChange).not.toHaveBeenCalled()
  })

  it('не вызывает onBlur при переходах внутри и вызывает один раз по Tab наружу', async () => {
    const user = userEvent.setup()
    const onBlur = vi.fn()
    render(
      <>
        <DatePicker value="2000-04-27" onChange={vi.fn()} onBlur={onBlur} />
        <input aria-label="Снаружи" />
      </>,
    )
    await user.click(calendarButton())
    await user.tab()
    await user.tab()
    await user.tab()
    await user.tab()
    expect(onBlur).not.toHaveBeenCalled()
    await user.tab()
    expect(screen.getByRole('textbox', { name: 'Снаружи' })).toHaveFocus()
    expect(onBlur).toHaveBeenCalledTimes(1)
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
  })
})
