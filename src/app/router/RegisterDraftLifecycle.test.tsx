import { StrictMode } from 'react'
import { act, screen } from '@testing-library/react'
import { Link, Route, Routes, useNavigate } from 'react-router-dom'

import { renderWithProviders } from '@/app/test/renderWithProviders'
import { AuthLayout } from '@/app/layouts/AuthLayout'
import { RegisterLayout } from '@/pages/register'
import {
  draftUpdated,
  registerReducer,
  selectRegisterDraft,
  stepCompleted,
  type RegisterStep,
} from '@/features/register'
import { ROUTES } from '@/shared/config'
import { useAppDispatch, useAppSelector } from '@/shared/lib/store'
import { RegisterStepGuard } from './RegisterStepGuard'
import { RegisterDraftLifecycle } from './RegisterDraftLifecycle'

// Формы и их валидация подключаются в P6-02/04/05. Проверяем их контракт с роутером.
function StepProbe({ step }: { step: RegisterStep }) {
  const dispatch = useAppDispatch()
  const navigate = useNavigate()
  const { email } = useAppSelector(selectRegisterDraft)
  return (
    <>
      <h2>Форма {step}</h2>
      <p>Email: {email}</p>
      {step < 3 && (
        <button
          onClick={() => {
            dispatch(draftUpdated({ email: 'new@mail.ru', password: 'Chernosliv5' }))
            dispatch(stepCompleted(step))
            navigate(step === 1 ? ROUTES.REGISTER_STEP_2 : ROUTES.REGISTER_STEP_3)
          }}
        >
          Далее
        </button>
      )}
      <button onClick={() => navigate(-1)}>Назад</button>
      <Link to={ROUTES.LOGIN}>Войти</Link>
      <Link to={ROUTES.REGISTER_STEP_3}>Сразу на шаг 3</Link>
    </>
  )
}

function TestRoutes() {
  return (
    <>
      <RegisterDraftLifecycle />
      <Routes>
        <Route
          path={ROUTES.HOME}
          element={
            <>
              <h1>Каталог</h1>
              <Link to={ROUTES.REGISTER_STEP_1}>Регистрация</Link>
            </>
          }
        />
        <Route element={<AuthLayout />}>
          <Route path={ROUTES.LOGIN} element={<h1>Вход</h1>} />
          <Route path={ROUTES.REGISTER} element={<RegisterLayout />}>
            <Route path={ROUTES.REGISTER_STEP_1} element={<StepProbe step={1} />} />
            <Route
              path={ROUTES.REGISTER_STEP_2}
              element={
                <RegisterStepGuard step={2}>
                  <StepProbe step={2} />
                </RegisterStepGuard>
              }
            />
            <Route
              path={ROUTES.REGISTER_STEP_3}
              element={
                <RegisterStepGuard step={3}>
                  <StepProbe step={3} />
                </RegisterStepGuard>
              }
            />
          </Route>
        </Route>
      </Routes>
    </>
  )
}

const renderFlow = (route: string = ROUTES.HOME) =>
  renderWithProviders(
    <StrictMode>
      <TestRoutes />
    </StrictMode>,
    { route },
  )

describe('RegisterDraftLifecycle', () => {
  it('сохраняет черновик и прогресс при переходах вперёд и назад', async () => {
    const { user, store } = renderFlow()
    await user.click(screen.getByRole('link', { name: 'Регистрация' }))
    await user.click(screen.getByRole('button', { name: 'Далее' }))
    await user.click(screen.getByRole('button', { name: 'Далее' }))
    await user.click(screen.getByRole('button', { name: 'Назад' }))
    expect(screen.getByRole('heading', { name: 'Форма 2' })).toBeInTheDocument()
    expect(screen.getByText('Email: new@mail.ru')).toBeInTheDocument()
    expect(store.getState().register.completedStep).toBe(2)
  })

  it.each([1, 2, 3])('закрытие шага %s выходит на главную и сбрасывает черновик', async (step) => {
    const { user, store } = renderFlow()
    await user.click(screen.getByRole('link', { name: 'Регистрация' }))
    for (let index = 1; index < step; index++)
      await user.click(screen.getByRole('button', { name: 'Далее' }))
    act(() => {
      store.dispatch(draftUpdated({ email: 'new@mail.ru', password: 'Chernosliv5' }))
    })
    await user.click(screen.getByRole('button', { name: 'Закрыть' }))
    expect(screen.getByRole('heading', { name: 'Каталог' })).toBeInTheDocument()
    expect(store.getState().register).toEqual(registerReducer(undefined, { type: '@@init' }))
  })

  it.each(['SkillSwap', 'Войти'])('выход по ссылке %s очищает черновик', async (name) => {
    const { user, store } = renderFlow(ROUTES.REGISTER_STEP_1)
    await user.click(screen.getByRole('button', { name: 'Далее' }))
    await user.click(screen.getByRole('link', { name }))
    expect(store.getState().register).toEqual(registerReducer(undefined, { type: '@@init' }))
  })

  it('уход назад из регистрации очищает пароль и прогресс', async () => {
    const { user, store } = renderFlow()
    await user.click(screen.getByRole('link', { name: 'Регистрация' }))
    await user.click(screen.getByRole('button', { name: 'Далее' }))
    await user.click(screen.getByRole('button', { name: 'Назад' }))
    await user.click(screen.getByRole('button', { name: 'Назад' }))
    expect(screen.getByRole('heading', { name: 'Каталог' })).toBeInTheDocument()
    expect(store.getState().register).toEqual(registerReducer(undefined, { type: '@@init' }))
  })

  it.each([ROUTES.REGISTER_STEP_2, ROUTES.REGISTER_STEP_3])(
    'новая вкладка на %s возвращается на первый шаг',
    (route) => {
      renderFlow(route)
      expect(screen.getByRole('heading', { name: 'Форма 1' })).toBeInTheDocument()
    },
  )

  it('редирект запрещённого шага заменяет запись истории', async () => {
    const { user } = renderFlow()
    await user.click(screen.getByRole('link', { name: 'Регистрация' }))
    await user.click(screen.getByRole('link', { name: 'Сразу на шаг 3' }))
    await user.click(screen.getByRole('button', { name: 'Назад' }))
    await user.click(screen.getByRole('button', { name: 'Назад' }))
    expect(screen.getByRole('heading', { name: 'Каталог' })).toBeInTheDocument()
  })

  it('наблюдатель в StrictMode сохраняет существующий черновик на разрешённом шаге', () => {
    const register = registerReducer(
      registerReducer(undefined, draftUpdated({ email: 'new@mail.ru' })),
      stepCompleted(1),
    )
    const { store } = renderWithProviders(
      <StrictMode>
        <TestRoutes />
      </StrictMode>,
      {
        route: `${ROUTES.REGISTER_STEP_2}/?from=test#form`,
        preloadedState: { register },
      },
    )
    expect(screen.getByRole('heading', { name: 'Форма 2' })).toBeInTheDocument()
    expect(store.getState().register).toEqual(register)
  })
})
