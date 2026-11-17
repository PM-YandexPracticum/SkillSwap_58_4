import { screen } from '@testing-library/react'
import { Route, Routes, useLocation, useNavigate } from 'react-router-dom'
import { createTestStore } from '@/app/test/createTestStore'
import { renderWithProviders } from '@/app/test/renderWithProviders'
import { startSession } from '@/entities/session'
import { fetchUsers } from '@/entities/user'
import { createUser } from '@/entities/user/testing'
import { ROUTES, STORAGE_KEYS } from '@/shared/config'
import { LogoutButton } from './LogoutButton'

function Address() {
  const location = useLocation()
  const navigate = useNavigate()
  return (
    <>
      <h1>{location.pathname}</h1>
      <button onClick={() => navigate(-1)}>Назад</button>
    </>
  )
}

describe('LogoutButton', () => {
  it.each([ROUTES.PROFILE, ROUTES.FAVORITES])(
    'выходит с %s на главную и сохраняет данные базы',
    async (route) => {
      const account = createUser()
      const store = createTestStore()
      store.dispatch(fetchUsers.fulfilled([account], 'users'))
      store.dispatch(startSession(account.id))
      localStorage.setItem('skillswap_db_users', JSON.stringify([account]))
      const before = store.getState()
      const { user } = renderWithProviders(
        <Routes>
          <Route path={ROUTES.HOME} element={<Address />} />
          <Route path={route} element={<LogoutButton />} />
          <Route path={ROUTES.LOGIN} element={<h1>Вход</h1>} />
        </Routes>,
        { route, store },
      )

      await user.click(screen.getByRole('button', { name: 'Выйти' }))
      expect(screen.getByRole('heading', { name: '/' })).toBeInTheDocument()
      expect(store.getState().session.session).toBeNull()
      expect(localStorage.getItem(STORAGE_KEYS.SESSION)).toBeNull()
      expect(localStorage.getItem('skillswap_db_users')).toBe(JSON.stringify([account]))
      expect(store.getState().users).toBe(before.users)
      expect(store.getState().exchanges).toBe(before.exchanges)
      expect(createTestStore().getState().session.session).toBeNull()
      await user.click(screen.getByRole('button', { name: 'Назад' }))
      expect(screen.getByRole('heading', { name: '/' })).toBeInTheDocument()
    },
  )
})
