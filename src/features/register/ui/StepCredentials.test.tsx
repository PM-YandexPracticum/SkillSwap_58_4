import { screen, waitFor } from '@testing-library/react'

import { renderWithProviders } from '@/app/test/renderWithProviders'
import { usersReducer } from '@/entities/user'
import { createUser } from '@/entities/user/testing'
import { ROUTES } from '@/shared/config'
import { StepCredentials } from './StepCredentials'

describe('StepCredentials', () => {
  it('показывает поля с подсказкой и ссылку входа', () => {
    renderWithProviders(<StepCredentials onNext={vi.fn()} />)

    expect(screen.getByLabelText('Email')).toHaveAttribute('autocomplete', 'email')
    expect(screen.getByLabelText('Пароль')).toHaveAttribute('autocomplete', 'new-password')
    expect(screen.getByLabelText('Пароль')).toHaveAccessibleDescription(
      'Пароль должен содержать не менее 8 знаков',
    )
    expect(screen.getByRole('link', { name: 'Войти' })).toHaveAttribute('href', ROUTES.LOGIN)
  })

  it.each(['кнопка', 'Enter'])('передаёт введённые значения через %s', async (action) => {
    const onNext = vi.fn()
    const { user } = renderWithProviders(<StepCredentials onNext={onNext} />)

    await user.type(screen.getByLabelText('Email'), 'user@example.com')
    await user.type(screen.getByLabelText('Пароль'), 'password123')
    if (action === 'Enter') await user.keyboard('{Enter}')
    else await user.click(screen.getByRole('button', { name: 'Далее' }))

    expect(onNext).toHaveBeenCalledTimes(1)
    expect(onNext).toHaveBeenCalledWith({ email: 'user@example.com', password: 'password123' })
  })

  it('переключение видимости пароля не переводит на следующий шаг', async () => {
    const onNext = vi.fn()
    const { user } = renderWithProviders(<StepCredentials onNext={onNext} />)

    await user.type(screen.getByLabelText('Пароль'), 'password123')
    await user.click(screen.getByRole('button', { name: 'Показать пароль' }))

    expect(screen.getByLabelText('Пароль')).toHaveAttribute('type', 'text')
    expect(screen.getByLabelText('Пароль')).toHaveValue('password123')
    expect(onNext).not.toHaveBeenCalled()
  })

  it('блокирует пустую форму и не показывает ошибки до ухода из поля', async () => {
    const onNext = vi.fn()
    const { user } = renderWithProviders(<StepCredentials onNext={onNext} />)

    expect(screen.getByRole('button', { name: 'Далее' })).toBeDisabled()
    expect(screen.queryByRole('alert')).not.toBeInTheDocument()
    await user.click(screen.getByLabelText('Email'))
    await user.tab()

    expect(await screen.findByText('Введите email')).toBeInTheDocument()
    expect(onNext).not.toHaveBeenCalled()
  })

  it.each([
    ['email', 'wrong', 'Введите корректный email'],
    ['password', 'a', 'Пароль должен содержать не менее 8 знаков'],
    ['password', 'abcdefgh', 'Пароль должен содержать хотя бы одну букву и одну цифру'],
    ['password', 'Abcdefg 1', 'Пароль не должен содержать пробелов'],
    ['password', `${'a'.repeat(64)}1`, 'Пароль должен содержать не более 64 знаков'],
  ])('проверяет %s при уходе из поля: %s', async (field, value, error) => {
    const onNext = vi.fn()
    const { user } = renderWithProviders(<StepCredentials onNext={onNext} />)
    const input = screen.getByLabelText(field === 'email' ? 'Email' : 'Пароль')

    await user.type(input, value)
    expect(screen.queryByRole('alert')).not.toBeInTheDocument()
    await user.tab()

    expect(await screen.findByText(error)).toBeInTheDocument()
    expect(input).toHaveAccessibleDescription(expect.stringContaining(error))
    expect(screen.getByRole('button', { name: 'Далее' })).toBeDisabled()
    await user.click(input)
    await user.keyboard('{Enter}')
    expect(onNext).not.toHaveBeenCalled()
  })

  it.each(['Abcdefg1', `${'a'.repeat(63)}1`])(
    'нормализует email и принимает допустимый пароль длиной %s',
    async (password) => {
      const onNext = vi.fn()
      const { user } = renderWithProviders(<StepCredentials onNext={onNext} />)

      await user.type(screen.getByLabelText('Email'), ' USER@example.com ')
      await user.type(screen.getByLabelText('Пароль'), password)
      await user.click(screen.getByRole('button', { name: 'Далее' }))

      await waitFor(() =>
        expect(onNext).toHaveBeenCalledWith({ email: 'user@example.com', password }),
      )
    },
  )

  it('отклоняет занятый email с пробелами и другим регистром, позволяет исправить его', async () => {
    const onNext = vi.fn()
    const { user } = renderWithProviders(<StepCredentials onNext={onNext} />, {
      preloadedState: {
        users: {
          ...usersReducer(undefined, { type: '@@init' }),
          items: [createUser({ email: 'ivan@example.com' })],
          status: 'succeeded',
        },
      },
    })

    const email = screen.getByLabelText('Email')
    await user.type(email, ' IVAN@example.com ')
    await user.type(screen.getByLabelText('Пароль'), 'Password123')
    await user.click(screen.getByRole('button', { name: 'Далее' }))

    expect(await screen.findByText('Email уже используется')).toBeInTheDocument()
    expect(email).toHaveFocus()
    expect(email).toHaveAccessibleDescription('Email уже используется')
    expect(screen.getByLabelText('Пароль')).not.toHaveAttribute('aria-invalid', 'true')
    expect(screen.getByLabelText('Пароль')).toHaveAccessibleDescription('Надёжный')
    expect(onNext).not.toHaveBeenCalled()

    await user.clear(email)
    await user.type(email, 'free@example.com')
    await user.tab()
    await waitFor(() => expect(screen.getByRole('button', { name: 'Далее' })).toBeEnabled())
    await user.click(screen.getByRole('button', { name: 'Далее' }))

    await waitFor(() =>
      expect(onNext).toHaveBeenCalledWith({ email: 'free@example.com', password: 'Password123' }),
    )
  })

  it('показывает «Надёжный» только после проверки пароля и снимает подсказку при ошибке', async () => {
    const { user } = renderWithProviders(<StepCredentials onNext={vi.fn()} />)
    const password = screen.getByLabelText('Пароль')

    await user.type(password, 'Password123')
    expect(screen.queryByText('Надёжный')).not.toBeInTheDocument()
    await user.tab()
    expect(await screen.findByText('Надёжный')).toBeInTheDocument()

    await user.clear(password)
    await user.type(password, 'a')
    expect(await screen.findByText('Пароль должен содержать не менее 8 знаков')).toBeInTheDocument()
    expect(screen.queryByText('Надёжный')).not.toBeInTheDocument()
  })

  it('восстанавливает значения черновика без повторного ввода', async () => {
    const onNext = vi.fn()
    const values = { email: 'saved@example.com', password: 'Password123' }
    const { user } = renderWithProviders(<StepCredentials onNext={onNext} defaultValues={values} />)

    expect(screen.getByLabelText('Email')).toHaveValue(values.email)
    expect(screen.getByLabelText('Пароль')).toHaveValue(values.password)
    await waitFor(() => expect(screen.getByRole('button', { name: 'Далее' })).toBeEnabled())
    await user.click(screen.getByRole('button', { name: 'Далее' }))

    await waitFor(() => expect(onNext).toHaveBeenCalledWith(values))
  })
})
