import { createRef, useState } from 'react'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { useForm } from 'react-hook-form'
import { Input } from './Input'
import EditIcon from '@/shared/assets/icons/edit.svg?react'

describe('Input', () => {
  it('позволяет вводить текст сразу и фокусируется по подписи', async () => {
    const user = userEvent.setup()
    render(<Input label="Имя" placeholder="Введите текст" />)
    await user.click(screen.getByText('Имя'))
    const field = screen.getByRole('textbox', { name: 'Имя' })
    expect(field).toHaveFocus()
    await user.type(field, 'Мария')
    expect(field).toHaveValue('Мария')
  })

  it('обновляет управляемое значение', async () => {
    function Example() {
      const [value, setValue] = useState('')
      return <Input label="Имя" value={value} onChange={(event) => setValue(event.target.value)} />
    }
    const user = userEvent.setup()
    render(<Example />)
    await user.type(screen.getByRole('textbox'), 'Мария')
    expect(screen.getByRole('textbox')).toHaveValue('Мария')
  })

  it('связывает ошибку с полем и сохраняет внешнюю подсказку', () => {
    render(
      <>
        <p id="hint">Подсказка формы</p>
        <Input label="Имя" aria-describedby="hint" error="Проверьте значение" />
      </>,
    )
    const field = screen.getByRole('textbox', { name: 'Имя' })
    expect(field).toHaveAttribute('aria-invalid', 'true')
    expect(field).toHaveAccessibleDescription('Подсказка формы Проверьте значение')
  })

  it('убирает ошибку после исправления', () => {
    const { rerender } = render(<Input label="Имя" error="Проверьте значение" />)
    rerender(<Input label="Имя" />)
    expect(screen.queryByText('Проверьте значение')).not.toBeInTheDocument()
    expect(screen.getByRole('textbox')).not.toHaveAttribute('aria-invalid', 'true')
  })

  it('не принимает ввод в отключённое поле', async () => {
    const user = userEvent.setup()
    render(<Input label="Имя" defaultValue="Мария" disabled />)
    await user.type(screen.getByRole('textbox'), ' новый текст')
    expect(screen.getByRole('textbox')).toBeDisabled()
    expect(screen.getByRole('textbox')).toHaveValue('Мария')
  })

  it('передаёт ref на HTML-поле', () => {
    const ref = createRef<HTMLInputElement>()
    render(<Input label="Имя" ref={ref} />)
    ref.current?.focus()
    expect(screen.getByRole('textbox')).toHaveFocus()
  })

  it('различает поля с одинаковыми подписями и принимает заданный id', () => {
    render(
      <>
        <Input label="Имя" />
        <Input label="Имя" id="custom-field" />
      </>,
    )
    const fields = screen.getAllByRole('textbox', { name: 'Имя' })
    expect(fields[0].id).not.toBe(fields[1].id)
    expect(fields[1]).toHaveAttribute('id', 'custom-field')
  })

  it('оставляет поле доступным при наличии декоративного карандаша', async () => {
    const user = userEvent.setup()
    render(<Input label="Имя" rightIcon={<EditIcon />} />)
    expect(screen.queryByRole('button')).not.toBeInTheDocument()
    await user.tab()
    expect(screen.getByRole('textbox')).toHaveFocus()
    await user.keyboard('Мария')
    expect(screen.getByRole('textbox')).toHaveValue('Мария')
  })

  it('работает с register и фокусировкой ошибки в react-hook-form', async () => {
    function Form() {
      const {
        register,
        handleSubmit,
        formState: { errors },
      } = useForm<{ text: string }>()
      const [result, setResult] = useState('')
      return (
        <form onSubmit={handleSubmit((data) => setResult(data.text))}>
          <Input
            label="Имя"
            error={errors.text?.message}
            {...register('text', { required: 'Заполните поле' })}
          />
          <button type="submit">Сохранить</button>
          <output>{result}</output>
        </form>
      )
    }
    const user = userEvent.setup()
    render(<Form />)
    await user.click(screen.getByRole('button', { name: 'Сохранить' }))
    expect(await screen.findByText('Заполните поле')).toBeInTheDocument()
    expect(screen.getByRole('textbox')).toHaveFocus()
    await user.type(screen.getByRole('textbox'), 'Мария')
    await user.click(screen.getByRole('button', { name: 'Сохранить' }))
    expect(screen.getByRole('status')).toHaveTextContent('Мария')
  })
})
