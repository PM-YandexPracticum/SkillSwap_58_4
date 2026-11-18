import { StrictMode } from 'react'
import { screen, waitFor } from '@testing-library/react'
import { Route, Routes } from 'react-router-dom'
import { createTestStore } from '@/app/test/createTestStore'
import { renderWithProviders } from '@/app/test/renderWithProviders'
import { fetchUsers } from '@/entities/user'
import { createUser } from '@/entities/user/testing'
import { startSession } from '@/entities/session'
import { DATA_ERRORS } from '@/shared/config'
import { MainLayout } from './MainLayout'

const { readNotifications } = vi.hoisted(() => ({ readNotifications: vi.fn() }))
vi.mock('@/entities/notification/api/notificationApi', async (importOriginal) => ({
  ...(await importOriginal<object>()),
  getNotifications: readNotifications,
}))

afterEach(() => vi.resetAllMocks())

it('MainLayout: ошибка загрузки → явный повтор → пустой список только после успеха', async () => {
  let finish!: (items: []) => void
  readNotifications.mockRejectedValueOnce(new Error('offline')).mockImplementationOnce(
    () =>
      new Promise((resolve) => {
        finish = resolve
      }),
  )
  const store = createTestStore()
  const account = createUser()
  store.dispatch(fetchUsers.fulfilled([account], 'users'))
  store.dispatch(startSession(account.id))
  const { user } = renderWithProviders(
    <StrictMode>
      <Routes>
        <Route element={<MainLayout />}>
          <Route path="/" element={<h1>Каталог</h1>} />
        </Route>
      </Routes>
    </StrictMode>,
    { store },
  )
  await waitFor(() => expect(store.getState().notifications.status).toBe('failed'))
  const bell = screen.getByRole('button', { name: 'Уведомления' })
  await user.click(bell)
  expect(screen.getByRole('alert')).toHaveTextContent(DATA_ERRORS.LOAD_NOTIFICATIONS)
  expect(screen.queryByText('Уведомлений пока нет')).not.toBeInTheDocument()
  await user.click(bell)
  await user.click(bell)
  expect(readNotifications).toHaveBeenCalledTimes(1)
  await user.click(screen.getByRole('button', { name: 'Повторить' }))
  expect(screen.queryByText('Уведомлений пока нет')).not.toBeInTheDocument()
  finish([])
  expect(await screen.findByText('Уведомлений пока нет')).toBeInTheDocument()
  expect(screen.queryByRole('alert')).not.toBeInTheDocument()
  expect(readNotifications).toHaveBeenCalledTimes(2)
})
