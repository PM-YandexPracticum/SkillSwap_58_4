import { render, screen, waitFor } from '@testing-library/react'
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

  it('разрешает отправку только с корректным email и непустым паролем', async () => {
    const user = userEvent.setup()
    const onSubmit = vi.fn()
    renderForm({ onSubmit })
    const button = screen.getByRole('button', { name: 'Войти' })

    expect(button).toBeDisabled()
    await user.type(screen.getByLabelText('Email'), 'invalid-email')
    await user.type(screen.getByLabelText('Пароль'), 'secret123')
    expect(button).toBeDisabled()

    await user.clear(screen.getByLabelText('Email'))
    await user.type(screen.getByLabelText('Email'), 'petrov@mail.ru')
    await waitFor(() => expect(button).toBeEnabled())

    await user.clear(screen.getByLabelText('Пароль'))
    await waitFor(() => expect(button).toBeDisabled())
    await user.keyboard('{Enter}')
    expect(onSubmit).not.toHaveBeenCalled()
  })

  it('показывает ошибку формата после ухода из поля и снимает после исправления', async () => {
    const user = userEvent.setup()
    renderForm()
    const email = screen.getByLabelText('Email')

    await user.type(email, 'invalid-email')
    expect(screen.queryByText('Введите корректный email')).not.toBeInTheDocument()
    await user.tab()
    expect(await screen.findByText('Введите корректный email')).toBeInTheDocument()
    expect(email).toHaveAttribute('aria-invalid', 'true')

    await user.clear(email)
    await user.type(email, 'petrov@mail.ru')
    await waitFor(() => expect(email).not.toHaveAttribute('aria-invalid'))
    expect(screen.queryByText('Введите корректный email')).not.toBeInTheDocument()
  })

  it('нормализует email, сохраняя пароль без новых требований регистрации', async () => {
    const user = userEvent.setup()
    const onSubmit = vi.fn()
    renderForm({ onSubmit })

    await user.type(screen.getByLabelText('Email'), ' PETROV@MAIL.RU ')
    await user.type(screen.getByLabelText('Пароль'), 'x')
    await user.click(screen.getByRole('button', { name: 'Войти' }))

    expect(onSubmit).toHaveBeenCalledWith({ email: 'petrov@mail.ru', password: 'x' })
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

    await user.type(screen.getByLabelText('Email'), 'petrov@mail.ru')
    await user.type(screen.getByLabelText('Пароль'), 'secret123')
    await waitFor(() => expect(screen.getByRole('button', { name: 'Войти' })).toBeEnabled())
    await user.tab({ shift: true })
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
