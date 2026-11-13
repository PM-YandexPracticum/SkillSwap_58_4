import { renderHook } from '@testing-library/react'
import { Provider } from 'react-redux'
import type { ReactNode } from 'react'

import { createTestStore } from '@/app/test/createTestStore'
import { createNotification } from '@/entities/notification/testing'
import { createUser } from '@/entities/user/testing'

import { useNotifications } from './useNotifications'

/**
 * Обёртка для `renderHook`: тот же store, что и `renderWithProviders`.
 * `preloadedState` намеренно неполный — тесту важны только нужные поля;
 * Redux заполнит недостающее из `initialState` слайсов.
 */
function createWrapper(preloadedState: Record<string, unknown>) {
  const store = createTestStore(preloadedState as never)
  return function Wrapper({ children }: { children: ReactNode }) {
    return <Provider store={store}>{children}</Provider>
  }
}

describe('useNotifications', () => {
  const me = createUser({ id: 'u01' })
  const ivan = createUser({ id: 'u02', name: 'Иван', gender: 'male' })

  it('без сессии не падает и отдаёт пустой список и hasUnread = false', () => {
    const { result } = renderHook(() => useNotifications(), {
      wrapper: createWrapper({
        notifications: {
          items: [createNotification({ userId: 'u99', toUserId: ivan.id })],
          status: 'succeeded',
          error: null,
        },
        users: { items: [me, ivan] },
      }),
    })

    expect(result.current.notifications).toEqual([])
    expect(result.current.hasUnread).toBe(false)
  })

  it('вошедшему отдаёт только свои уведомления со склоненным именем', () => {
    const own = createNotification({ userId: 'u01', toUserId: ivan.id })

    const { result } = renderHook(() => useNotifications(), {
      wrapper: createWrapper({
        session: { session: { userId: 'u01', token: 't' } },
        notifications: {
          items: [own, createNotification({ userId: 'u99', toUserId: ivan.id })],
          status: 'succeeded',
          error: null,
        },
        users: { items: [me, ivan] },
      }),
    })

    expect(result.current.notifications).toHaveLength(1)
    expect(result.current.notifications[0].userName).toBe('Ивану')
    expect(result.current.hasUnread).toBe(true)
  })

  it('показывает isLoading при статусе loading', () => {
    const { result } = renderHook(() => useNotifications(), {
      wrapper: createWrapper({
        notifications: { items: [], status: 'loading', error: null },
      }),
    })

    expect(result.current.isLoading).toBe(true)
  })

  it('после ошибки отдаёт текст и функцию retry', () => {
    const wrapper = createWrapper({
      session: { session: { userId: 'u01', token: 't' } },
      notifications: { items: [], status: 'rejected', error: 'Не удалось загрузить уведомления' },
    })
    const { result } = renderHook(() => useNotifications(), { wrapper })

    expect(result.current.error).toBe('Не удалось загрузить уведомления')
    expect(typeof result.current.retry).toBe('function')
  })
})
