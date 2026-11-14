import { screen } from '@testing-library/react'

import { renderWithProviders } from '@/app/test/renderWithProviders'
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

  it('показывает ошибку email и сохраняет подсказку пароля', () => {
    renderWithProviders(<StepCredentials onNext={vi.fn()} emailError="Email уже используется" />)

    expect(screen.getByLabelText('Email')).toHaveAttribute('aria-invalid', 'true')
    expect(screen.getByLabelText('Email')).toHaveAccessibleDescription('Email уже используется')
    expect(screen.getByText('Email уже используется')).toBeInTheDocument()
    expect(screen.getByLabelText('Пароль')).not.toHaveAttribute('aria-invalid', 'true')
    expect(screen.getByText('Пароль должен содержать не менее 8 знаков')).toBeInTheDocument()
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

  it('показывает ошибку, если email уже используется', async () => {
    const onNext = vi.fn()

    const { user } = renderWithProviders(<StepCredentials onNext={onNext} />, {
      preloadedState: {
        users: {
          items: [
            {
              id: 'u01',
              name: 'Ivan',
              email: 'ivan@example.com',
              password: 'Password123',
              avatarUrl: null,
              birthDate: '1990-01-01',
              gender: null,
              cityId: 'c01',
              about: '',
              teachSkillId: 's01',
              learnSubcategoryIds: [],
              likedUserIds: [],
              likesCount: 0,
              createdAt: '2025-01-01',
            },
          ],
          status: 'succeeded',
          error: null,
          saveStatus: 'idle',
          pendingSaves: 0,
          saveError: null,
        },
      },
    })

    await user.type(screen.getByLabelText('Email'), 'ivan@example.com')
    await user.type(screen.getByLabelText('Пароль'), 'Password123')
    await user.click(screen.getByRole('button', { name: 'Далее' }))

    expect(screen.getByText('Email уже используется')).toBeInTheDocument()
    expect(onNext).not.toHaveBeenCalled()
  })
})
