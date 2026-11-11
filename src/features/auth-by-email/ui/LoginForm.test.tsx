import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router-dom'

import { ROUTES } from '@/shared/config'

import { LoginForm, type LoginFormProps } from './LoginForm'

const ERROR = 'Email или пароль введён неверно'

const renderForm = (props: LoginFormProps = {}) =>
  render(
    <MemoryRouter>
      <LoginForm {...props} />
    </MemoryRouter>,
  )

describe('LoginForm', () => {
  it('показывает поля Email и Пароль, кнопку «Войти»', () => {
    renderForm()

    expect(screen.getByLabelText('Email')).toHaveAttribute('type', 'email')
    expect(screen.getByLabelText('Пароль')).toHaveAttribute('type', 'password')
    expect(screen.getByRole('button', { name: 'Войти' })).toHaveAttribute('type', 'submit')
  })

  it('«Зарегистрироваться» ведёт на регистрацию', () => {
    renderForm()

    expect(screen.getByRole('link', { name: 'Зарегистрироваться' })).toHaveAttribute(
      'href',
      ROUTES.REGISTER,
    )
  })

  it('по «Войти» отдаёт введённые email и пароль', async () => {
    const user = userEvent.setup()
    const onSubmit = vi.fn()
    renderForm({ onSubmit })

    await user.type(screen.getByLabelText('Email'), 'petrov@mail.ru')
    await user.type(screen.getByLabelText('Пароль'), 'secret123')
    await user.click(screen.getByRole('button', { name: 'Войти' }))

    expect(onSubmit).toHaveBeenCalledWith({ email: 'petrov@mail.ru', password: 'secret123' })
  })

  it('отправляется по Enter из поля пароля', async () => {
    const user = userEvent.setup()
    const onSubmit = vi.fn()
    renderForm({ onSubmit })

    await user.type(screen.getByLabelText('Email'), 'petrov@mail.ru')
    await user.type(screen.getByLabelText('Пароль'), 'secret123{Enter}')

    expect(onSubmit).toHaveBeenCalledTimes(1)
  })

  it('без ошибки поля не помечены как неверные', () => {
    renderForm()

    expect(screen.getByLabelText('Email')).not.toHaveAttribute('aria-invalid')
    expect(screen.queryByRole('alert')).not.toBeInTheDocument()
  })

  it('общая ошибка: оба поля помечены и связаны с текстом ошибки', () => {
    renderForm({ error: ERROR })

    expect(screen.getByRole('alert')).toHaveTextContent(ERROR)
    expect(screen.getByLabelText('Email')).toHaveAttribute('aria-invalid', 'true')
    expect(screen.getByLabelText('Email')).toHaveAccessibleDescription(ERROR)
    expect(screen.getByLabelText('Пароль')).toHaveAttribute('aria-invalid', 'true')
    expect(screen.getByLabelText('Пароль')).toHaveAccessibleDescription(ERROR)
  })

  it('с клавиатуры: Email → Пароль → «глаз» → «Войти» → ссылка', async () => {
    const user = userEvent.setup()
    renderForm()

    await user.tab()
    expect(screen.getByLabelText('Email')).toHaveFocus()
    await user.tab()
    expect(screen.getByLabelText('Пароль')).toHaveFocus()
    await user.tab()
    expect(screen.getByRole('button', { name: 'Показать пароль' })).toHaveFocus()
    await user.tab()
    expect(screen.getByRole('button', { name: 'Войти' })).toHaveFocus()
    await user.tab()
    expect(screen.getByRole('link', { name: 'Зарегистрироваться' })).toHaveFocus()
  })
})
