import { screen } from '@testing-library/react'
import { Route, Routes } from 'react-router-dom'

import { renderWithProviders } from '@/app/test/renderWithProviders'
import { registerReducer, stepCompleted, type RegisterStep } from '@/features/register'
import { ROUTES } from '@/shared/config'

import { RegisterStepGuard } from './RegisterStepGuard'

/** Шаг 1 открыт всем, на шагах 2 и 3 стоит охрана */
const TestRoutes = () => (
  <Routes>
    <Route path={ROUTES.REGISTER_STEP_1} element={<h1>Шаг 1</h1>} />
    <Route
      path={ROUTES.REGISTER_STEP_2}
      element={
        <RegisterStepGuard step={2}>
          <h1>Шаг 2</h1>
        </RegisterStepGuard>
      }
    />
    <Route
      path={ROUTES.REGISTER_STEP_3}
      element={
        <RegisterStepGuard step={3}>
          <h1>Шаг 3</h1>
        </RegisterStepGuard>
      }
    />
  </Routes>
)

/** Состояние регистрации, в котором пройдены шаги до `completedStep` включительно (0 — ничего) */
const registerState = (completedStep: 0 | RegisterStep) =>
  completedStep === 0
    ? registerReducer(undefined, { type: '@@init' })
    : registerReducer(undefined, stepCompleted(completedStep))

const renderAt = (route: string, completedStep: 0 | RegisterStep) =>
  renderWithProviders(<TestRoutes />, {
    route,
    preloadedState: { register: registerState(completedStep) },
  })

describe('RegisterStepGuard', () => {
  it.each([
    { route: ROUTES.REGISTER_STEP_2, completedStep: 0 },
    { route: ROUTES.REGISTER_STEP_3, completedStep: 0 },
    { route: ROUTES.REGISTER_STEP_3, completedStep: 1 },
  ] as const)(
    'прямой заход на $route при пройденном шаге $completedStep ведёт на шаг 1',
    ({ route, completedStep }) => {
      renderAt(route, completedStep)

      expect(screen.getByRole('heading', { name: 'Шаг 1' })).toBeInTheDocument()
    },
  )

  it('пускает на шаг 2, когда пройден шаг 1', () => {
    renderAt(ROUTES.REGISTER_STEP_2, 1)

    expect(screen.getByRole('heading', { name: 'Шаг 2' })).toBeInTheDocument()
  })

  it('пускает на шаг 3, когда пройден шаг 2', () => {
    renderAt(ROUTES.REGISTER_STEP_3, 2)

    expect(screen.getByRole('heading', { name: 'Шаг 3' })).toBeInTheDocument()
  })

  it('пускает назад на шаг 2, когда пройдены все шаги', () => {
    renderAt(ROUTES.REGISTER_STEP_2, 3)

    expect(screen.getByRole('heading', { name: 'Шаг 2' })).toBeInTheDocument()
  })
})
