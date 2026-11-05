import { createRef, useState } from 'react'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { useForm } from 'react-hook-form'
import { Textarea } from './Textarea'
import EditIcon from '@/shared/assets/icons/edit.svg?react'

describe('Textarea', () => {
  it('позволяет вводить текст сразу и фокусируется по подписи', async () => {
    const user = userEvent.setup()
    render(<Textarea label="О себе" placeholder="Введите текст" />)
    await user.click(screen.getByText('О себе'))
    const field = screen.getByRole('textbox', { name: 'О себе' })
    expect(field).toHaveFocus()
    await user.type(field, 'Люблю учиться новому')
    expect(field).toHaveValue('Люблю учиться новому')
  })

  it('обновляет управляемое значение', async () => {
    function Example() {
      const [value, setValue] = useState('')
      return (
        <Textarea label="О себе" value={value} onChange={(event) => setValue(event.target.value)} />
      )
    }
    const user = userEvent.setup()
    render(<Example />)
    await user.type(screen.getByRole('textbox'), 'Люблю учиться новому')
    expect(screen.getByRole('textbox')).toHaveValue('Люблю учиться новому')
  })

  it('связывает ошибку с полем и сохраняет внешнюю подсказку', () => {
    render(
      <>
        <p id="hint">Подсказка формы</p>
        <Textarea label="О себе" aria-describedby="hint" error="Проверьте значение" />
      </>,
    )
    const field = screen.getByRole('textbox', { name: 'О себе' })
    expect(field).toHaveAttribute('aria-invalid', 'true')
    expect(field).toHaveAccessibleDescription('Подсказка формы Проверьте значение')
  })

  it('убирает ошибку после исправления', () => {
    const { rerender } = render(<Textarea label="О себе" error="Проверьте значение" />)
    rerender(<Textarea label="О себе" />)
    expect(screen.queryByText('Проверьте значение')).not.toBeInTheDocument()
    expect(screen.getByRole('textbox')).not.toHaveAttribute('aria-invalid', 'true')
  })

  it('не принимает ввод в отключённое поле', async () => {
    const user = userEvent.setup()
    render(<Textarea label="О себе" defaultValue="Люблю учиться новому" disabled />)
    await user.type(screen.getByRole('textbox'), ' новый текст')
    expect(screen.getByRole('textbox')).toBeDisabled()
    expect(screen.getByRole('textbox')).toHaveValue('Люблю учиться новому')
  })

  it('передаёт ref на HTML-поле', () => {
    const ref = createRef<HTMLTextAreaElement>()
    render(<Textarea label="О себе" ref={ref} />)
    ref.current?.focus()
    expect(screen.getByRole('textbox')).toHaveFocus()
  })

  it('различает поля с одинаковыми подписями и принимает заданный id', () => {
    render(
      <>
        <Textarea label="О себе" />
        <Textarea label="О себе" id="custom-field" />
      </>,
    )
    const fields = screen.getAllByRole('textbox', { name: 'О себе' })
    expect(fields[0].id).not.toBe(fields[1].id)
    expect(fields[1]).toHaveAttribute('id', 'custom-field')
  })

  it('оставляет поле доступным при наличии декоративного карандаша', async () => {
    const user = userEvent.setup()
    render(<Textarea label="О себе" rightIcon={<EditIcon />} />)
    expect(screen.queryByRole('button')).not.toBeInTheDocument()
    await user.tab()
    expect(screen.getByRole('textbox')).toHaveFocus()
    await user.keyboard('Люблю учиться новому')
    expect(screen.getByRole('textbox')).toHaveValue('Люблю учиться новому')
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
          <Textarea
            label="О себе"
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
    await user.type(screen.getByRole('textbox'), 'Люблю учиться новому')
    await user.click(screen.getByRole('button', { name: 'Сохранить' }))
    expect(screen.getByRole('status')).toHaveTextContent('Люблю учиться новому')
  })
})
