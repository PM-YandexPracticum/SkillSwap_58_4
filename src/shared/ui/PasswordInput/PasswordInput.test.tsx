import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { createRef } from 'react'
import { useForm } from 'react-hook-form'

import { PasswordInput } from './PasswordInput'

const HINT = 'Пароль должен содержать не менее 8 знаков'

describe('PasswordInput', () => {
  it('по умолчанию пароль скрыт', () => {
    render(<PasswordInput label="Пароль" />)

    expect(screen.getByLabelText('Пароль')).toHaveAttribute('type', 'password')
    expect(screen.getByRole('button', { name: 'Показать пароль' })).toBeInTheDocument()
  })

  it('«глаз» показывает и снова скрывает пароль', async () => {
    const user = userEvent.setup()
    render(<PasswordInput label="Пароль" />)

    await user.click(screen.getByRole('button', { name: 'Показать пароль' }))
    expect(screen.getByLabelText('Пароль')).toHaveAttribute('type', 'text')

    await user.click(screen.getByRole('button', { name: 'Скрыть пароль' }))
    expect(screen.getByLabelText('Пароль')).toHaveAttribute('type', 'password')
  })

  it('переключается с клавиатуры и не отправляет форму', async () => {
    const user = userEvent.setup()
    const onSubmit = vi.fn((e: React.FormEvent) => e.preventDefault())
    render(
      <form onSubmit={onSubmit}>
        <PasswordInput label="Пароль" />
      </form>,
    )

    await user.tab()
    await user.tab()
    expect(screen.getByRole('button', { name: 'Показать пароль' })).toHaveFocus()

    await user.keyboard('{Enter}')
    expect(screen.getByLabelText('Пароль')).toHaveAttribute('type', 'text')
    expect(onSubmit).not.toHaveBeenCalled()
  })

  it('показывает подсказку и связывает её с полем', () => {
    render(<PasswordInput label="Пароль" hint={HINT} />)

    expect(screen.getByText(HINT)).toBeInTheDocument()
    expect(screen.getByLabelText('Пароль')).toHaveAccessibleDescription(HINT)
  })

  it('при ошибке скрывает подсказку и показывает ошибку', () => {
    render(<PasswordInput label="Пароль" hint={HINT} error="Слишком короткий" />)

    expect(screen.queryByText(HINT)).not.toBeInTheDocument()
    expect(screen.getByText('Слишком короткий')).toBeInTheDocument()
    expect(screen.getByLabelText('Пароль')).toHaveAttribute('aria-invalid', 'true')
  })

  it('сохраняет переданный aria-describedby', () => {
    render(
      <>
        <p id="extra">Дополнительно</p>
        <PasswordInput label="Пароль" hint={HINT} aria-describedby="extra" />
      </>,
    )

    expect(screen.getByLabelText('Пароль')).toHaveAccessibleDescription(`Дополнительно ${HINT}`)
  })

  it('передаёт ref на поле ввода', () => {
    const ref = createRef<HTMLInputElement>()
    render(<PasswordInput label="Пароль" ref={ref} />)

    expect(ref.current).toBe(screen.getByLabelText('Пароль'))
  })

  it('работает с react-hook-form', async () => {
    const user = userEvent.setup()
    const onValid = vi.fn()

    function Form() {
      const { register, handleSubmit } = useForm<{ password: string }>()
      return (
        <form onSubmit={handleSubmit(onValid)}>
          <PasswordInput label="Пароль" {...register('password')} />
          <button type="submit">Отправить</button>
        </form>
      )
    }

    render(<Form />)
    await user.type(screen.getByLabelText('Пароль'), 'secret123')
    await user.click(screen.getByRole('button', { name: 'Отправить' }))

    expect(onValid).toHaveBeenCalledWith({ password: 'secret123' }, expect.anything())
  })

    it('в disabled-состоянии поле недоступно, а кнопка-«глаз» не рендерится', () => {
    render(<PasswordInput label="Пароль" disabled />)

    const input = screen.getByLabelText('Пароль')

    expect(input).toBeDisabled()
    expect(input).toHaveAttribute('type', 'password')
    expect(screen.queryByRole('button', { name: 'Показать пароль' })).not.toBeInTheDocument()
  })
})
