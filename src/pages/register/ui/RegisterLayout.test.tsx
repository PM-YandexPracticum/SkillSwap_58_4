import { screen } from '@testing-library/react'
import { StrictMode } from 'react'
import { Navigate, Route, Routes } from 'react-router-dom'

import { renderWithProviders } from '@/app/test/renderWithProviders'
import { registerReducer } from '@/features/register'
import { ROUTES } from '@/shared/config'
import { RegisterLayout } from './RegisterLayout'
import { RegisterStep1Page } from './RegisterStep1Page'

function RegistrationRoutes() {
  return (
    <Routes>
      <Route path={ROUTES.REGISTER} element={<RegisterLayout />}>
        <Route index element={<Navigate to={ROUTES.REGISTER_STEP_1} replace />} />
        <Route path={ROUTES.REGISTER_STEP_1} element={<RegisterStep1Page />} />
        <Route path={ROUTES.REGISTER_STEP_2} element={<p>Содержимое шага 2</p>} />
        <Route path={ROUTES.REGISTER_STEP_3} element={<p>Содержимое шага 3</p>} />
      </Route>
    </Routes>
  )
}

describe('RegisterLayout', () => {
  it.each([
    [ROUTES.REGISTER, 1, 'Добро пожаловать в SkillSwap!'],
    [ROUTES.REGISTER_STEP_1, 1, 'Добро пожаловать в SkillSwap!'],
    [ROUTES.REGISTER_STEP_2, 2, 'Расскажите немного о себе'],
    [`${ROUTES.REGISTER_STEP_2}/?test=1#details`, 2, 'Расскажите немного о себе'],
    [ROUTES.REGISTER_STEP_3, 3, 'Укажите, чем вы готовы поделиться'],
  ])('показывает рамку и иллюстрацию для %s', (route, step, title) => {
    renderWithProviders(<RegistrationRoutes />, { route })

    expect(screen.getAllByRole('main')).toHaveLength(1)
    expect(screen.getByRole('heading', { level: 1, name: 'Регистрация' })).toBeInTheDocument()
    expect(screen.getByText(`Шаг ${step} из 3`)).toBeInTheDocument()
    expect(screen.getByRole('heading', { level: 2, name: title })).toBeInTheDocument()
  })

  it('«Далее» открывает второй шаг и обновляет индикатор без сохранения данных', async () => {
    const { user, store } = renderWithProviders(<RegistrationRoutes />, {
      route: ROUTES.REGISTER_STEP_1,
    })

    await user.type(screen.getByLabelText('Email'), 'user@example.com')
    await user.type(screen.getByLabelText('Пароль'), 'password123')
    await user.click(screen.getByRole('button', { name: 'Далее' }))

    expect(screen.getByText('Шаг 2 из 3')).toBeInTheDocument()
    expect(screen.getByText('Содержимое шага 2')).toBeInTheDocument()
    expect(store.getState().register.draft.email).toBe('')
    expect(store.getState().register.completedStep).toBe(0)
  })

  it('на шаге 1 ссылка входа открывает /login', async () => {
    const { user } = renderWithProviders(
      <Routes>
        <Route path={ROUTES.REGISTER_STEP_1} element={<RegisterStep1Page />} />
        <Route path={ROUTES.LOGIN} element={<h1>Вход</h1>} />
      </Routes>,
      { route: ROUTES.REGISTER_STEP_1 },
    )
    await user.click(screen.getByRole('link', { name: 'Войти' }))
    expect(screen.getByRole('heading', { name: 'Вход' })).toBeInTheDocument()
  })

  it('не сбрасывает черновик при повторном монтировании StrictMode', () => {
    const { store } = renderWithProviders(
      <StrictMode>
        <RegistrationRoutes />
      </StrictMode>,
      {
        route: ROUTES.REGISTER_STEP_2,
        preloadedState: {
          register: {
            draft: {
              ...registerReducer(undefined, { type: '@@init' }).draft,
              email: 'new@mail.ru',
            },
            completedStep: 1,
          },
        },
      },
    )

    expect(store.getState().register.draft.email).toBe('new@mail.ru')
    expect(store.getState().register.completedStep).toBe(1)
  })
})
