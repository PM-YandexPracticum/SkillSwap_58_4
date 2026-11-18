import { StrictMode, type ReactNode } from 'react'
import { act, renderHook, waitFor } from '@testing-library/react'
import { Provider } from 'react-redux'
import { createTestStore } from '@/app/test/createTestStore'
import { startSession, endSession } from '@/entities/session'
import { createNotification } from '@/entities/notification/testing'
import { createUser } from '@/entities/user/testing'
import { fetchUsers } from '@/entities/user'
import { DATA_ERRORS } from '@/shared/config'
import { useNotifications } from './useNotifications'

const { readNotifications } = vi.hoisted(() => ({ readNotifications: vi.fn() }))
vi.mock('@/entities/notification/api/notificationApi', async (importOriginal) => ({
  ...(await importOriginal<object>()),
  getNotifications: readNotifications,
}))

function setup(userId?: string) {
  const store = createTestStore()
  const me = createUser({ id: 'me' })
  const recipient = createUser({ id: 'recipient', name: 'Иван', gender: 'male' })
  store.dispatch(fetchUsers.fulfilled([me, recipient], 'users'))
  if (userId) store.dispatch(startSession(userId))
  const wrapper = ({ children }: { children: ReactNode }) => (
    <StrictMode>
      <Provider store={store}>{children}</Provider>
    </StrictMode>
  )
  return { store, ...renderHook(() => useNotifications(), { wrapper }) }
}

describe('useNotifications', () => {
  afterEach(() => vi.resetAllMocks())

  it('не загружает данные гостю', () => {
    const read = readNotifications.mockResolvedValue([])
    const { result } = setup()
    expect(result.current.notifications).toEqual([])
    expect(read).not.toHaveBeenCalled()
  })

  it('в StrictMode загружает один раз, отдаёт только свои уведомления и готовое имя', async () => {
    const own = createNotification({ userId: 'me', toUserId: 'recipient' })
    const read = readNotifications.mockResolvedValue([
      own,
      createNotification({ id: 'other', userId: 'other' }),
    ])
    const { result } = setup('me')
    await waitFor(() => expect(result.current.status).toBe('succeeded'))
    expect(result.current.notifications).toEqual([{ ...own, userName: 'Ивану' }])
    expect(read).toHaveBeenCalledTimes(1)
  })

  it('после ошибки ждёт ручного повтора, два синхронных повтора дают один запрос', async () => {
    const read = readNotifications.mockRejectedValueOnce(new Error('offline')).mockResolvedValue([])
    const { result, rerender } = setup('me')
    await waitFor(() => expect(result.current.loadError).toBe(DATA_ERRORS.LOAD_NOTIFICATIONS))
    rerender()
    expect(read).toHaveBeenCalledTimes(1)
    await act(async () => {
      result.current.retry()
      result.current.retry()
    })
    await waitFor(() => expect(result.current.status).toBe('succeeded'))
    expect(result.current.loadError).toBeNull()
    expect(read).toHaveBeenCalledTimes(2)
  })

  it('после ошибки загружает данные при прямой смене пользователя', async () => {
    const read = readNotifications.mockRejectedValueOnce(new Error('offline')).mockResolvedValue([])
    const { result, store } = setup('me')
    await waitFor(() => expect(result.current.loadError).toBeTruthy())
    await act(async () => {
      store.dispatch(startSession('other'))
    })
    await waitFor(() => expect(result.current.status).toBe('succeeded'))
    expect(read).toHaveBeenCalledTimes(2)
  })

  it('поздний ответ после выхода не показывает уведомления гостю', async () => {
    let finish!: (items: ReturnType<typeof createNotification>[]) => void
    readNotifications.mockImplementation(
      () =>
        new Promise((resolve) => {
          finish = resolve
        }),
    )
    const { result, store } = setup('me')
    act(() => {
      store.dispatch(endSession())
    })
    await act(async () => {
      finish([createNotification({ userId: 'me', toUserId: 'recipient' })])
    })
    expect(result.current.notifications).toEqual([])
  })
})
