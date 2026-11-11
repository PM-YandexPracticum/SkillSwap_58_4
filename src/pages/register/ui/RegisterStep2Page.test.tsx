import { screen } from '@testing-library/react'
import { Route, Routes, useLocation } from 'react-router-dom'

import { renderWithProviders } from '@/app/test/renderWithProviders'
import { createCategory } from '@/entities/category/testing'
import { ROUTES } from '@/shared/config'
import { RegisterStep2Page } from './RegisterStep2Page'

const preloadedState = {
  categories: { items: [createCategory()], status: 'succeeded' as const },
  cities: { items: [{ id: 'moscow', name: 'Москва' }], status: 'succeeded' as const },
}

function Location() {
  const { pathname, search, hash } = useLocation()
  return (
    <p>
      Адрес: {pathname}
      {search}
      {hash}
    </p>
  )
}

function RegistrationRoutes() {
  return (
    <Routes>
      <Route path={ROUTES.REGISTER_STEP_2} element={<RegisterStep2Page />} />
      <Route path={ROUTES.REGISTER_STEP_1} element={<Location />} />
      <Route path={ROUTES.REGISTER_STEP_3} element={<Location />} />
      <Route path={ROUTES.SERVER_ERROR} element={<h1>Ошибка сервера</h1>} />
    </Routes>
  )
}

describe('RegisterStep2Page', () => {
  it.each(['Назад', 'Продолжить'])(
    'переходит по кнопке «%s» без сохранения данных и query-параметров',
    async (button) => {
      const { user, store } = renderWithProviders(<RegistrationRoutes />, {
        route: ROUTES.REGISTER_STEP_2,
        preloadedState,
      })
      await user.type(screen.getByLabelText('Имя'), 'Ирина')
      await user.click(screen.getByRole('button', { name: button }))
      const target = button === 'Назад' ? ROUTES.REGISTER_STEP_1 : ROUTES.REGISTER_STEP_3
      expect(screen.getByText(`Адрес: ${target}`)).toBeInTheDocument()
      expect(store.getState().register.draft.name).toBe('')
    },
  )

  it('показывает Loader, если общий провайдер ещё не завершил загрузку', () => {
    renderWithProviders(<RegistrationRoutes />, {
      route: ROUTES.REGISTER_STEP_2,
      preloadedState: {
        categories: { items: [], status: 'loading' },
        cities: { items: [], status: 'loading' },
      },
    })
    expect(screen.getByRole('status', { name: 'Загрузка' })).toBeInTheDocument()
  })

  it.each(['categories', 'cities'] as const)('при ошибке %s открывает страницу ошибки', (slice) => {
    renderWithProviders(<RegistrationRoutes />, {
      route: ROUTES.REGISTER_STEP_2,
      preloadedState: { ...preloadedState, [slice]: { items: [], status: 'failed' } },
    })
    expect(screen.getByRole('heading', { name: 'Ошибка сервера' })).toBeInTheDocument()
    expect(screen.queryByRole('form')).not.toBeInTheDocument()
  })
})
