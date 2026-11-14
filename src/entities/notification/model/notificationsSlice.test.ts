import { createTestStore } from '@/app/test/createTestStore'
import { createNotification } from '../testing'
import * as notificationApi from '../api/notificationApi'
import { createNotification as saveNotification, getNotifications } from '../api/notificationApi'
import {
  addNotification,
  fetchNotifications,
  markAllRead,
  clearAllNotifications,
  notificationsReducer,
} from './notificationsSlice'
import {
  selectNotifications,
  selectHasUnread,
  selectNotificationsStatus,
  selectNotificationsError,
} from './selectors'

import { DATA_ERRORS } from '@/shared/config'

const own = createNotification({ id: 'test-own', userId: 'test-owner' })
const other = createNotification({ id: 'test-other', userId: 'test-other-owner' })
const signedInStore = () => {
  return createTestStore({ session: { session: { userId: own.userId, token: 'test' } } })
}

const bulkActions = [
  {
    name: 'прочитать все',
    run: (store: ReturnType<typeof createTestStore>) => store.dispatch(markAllRead()).unwrap(),
  },
  {
    name: 'очистить',
    run: (store: ReturnType<typeof createTestStore>) =>
      store.dispatch(clearAllNotifications()).unwrap(),
  },
]

describe('notificationsSlice', () => {
  it('созданное уведомление остаётся после перезагрузки store', async () => {
    const before = signedInStore()
    await before.dispatch(addNotification(own)).unwrap()
    const after = createTestStore({ session: { session: { userId: own.userId, token: 'test' } } })
    await after.dispatch(fetchNotifications()).unwrap()
    expect(selectNotifications(after.getState())).toEqual([own])
    expect(selectHasUnread(after.getState())).toBe(true)
  })

  it('показывает только уведомления вошедшего, после выхода скрывает их', async () => {
    await saveNotification(own)
    await saveNotification(other)
    const store = signedInStore()
    const loading = store.dispatch(fetchNotifications())
    expect(selectNotificationsStatus(store.getState())).toBe('loading')
    await loading.unwrap()
    const selected = selectNotifications(store.getState())
    expect(selected).toEqual([own])
    expect(selectNotifications(store.getState())).toBe(selected)
    const otherState = {
      ...store.getState(),
      session: { session: { userId: other.userId, token: 'test' } },
    } as RootState
    expect(selectNotifications(otherState)).toEqual([other])
    const guestState = { ...store.getState(), session: { session: null } } as RootState
    expect(selectNotifications(guestState)).toEqual([])
    expect(selectHasUnread(guestState)).toBe(false)
  })

  it('чужие новые уведомления не зажигают точку текущему пользователю', async () => {
    await saveNotification(other)
    const store = signedInStore()
    await store.dispatch(fetchNotifications()).unwrap()
    expect(selectHasUnread(store.getState())).toBe(false)
  })

  it('прочитать все сохраняется после перезагрузки и не меняет чужие записи', async () => {
    await saveNotification(own)
    await saveNotification(other)
    const store = signedInStore()
    await store.dispatch(markAllRead()).unwrap()
    const after = createTestStore({ session: { session: { userId: own.userId, token: 'test' } } })
    await after.dispatch(fetchNotifications()).unwrap()
    expect(selectNotifications(after.getState())).toEqual([{ ...own, isRead: true }])
    expect(selectHasUnread(after.getState())).toBe(false)
    expect(await getNotifications()).toContainEqual(other)
  })

  it('очистить удаляет новые и просмотренные, после перезагрузки они не возвращаются', async () => {
    await saveNotification(own)
    await saveNotification(createNotification({ id: 'read', userId: own.userId, isRead: true }))
    await saveNotification(other)
    const store = signedInStore()
    await store.dispatch(clearAllNotifications()).unwrap()
    const after = createTestStore({ session: { session: { userId: own.userId, token: 'test' } } })
    await after.dispatch(fetchNotifications()).unwrap()
    expect(selectNotifications(after.getState())).toEqual([])
    expect(await getNotifications()).toContainEqual(other)
  })

  it.each([null, 'other-owner'])(
    'не создаёт уведомление от чужого имени при сессии %s',
    async (userId) => {
      const store = createTestStore({
        session: { session: userId ? { userId, token: 'test' } : null },
      })
      await expect(store.dispatch(addNotification(own)).unwrap()).rejects.toBeTruthy()
      expect((await getNotifications()).some((item) => item.id === own.id)).toBe(false)
    },
  )

  it.each(bulkActions)('гость не может выполнить «$name»', async ({ run }) => {
    await saveNotification(other)
    const store = createTestStore({ session: { session: null } })
    await expect(run(store)).rejects.toBeTruthy()
    expect(await getNotifications()).toContainEqual(other)
  })

  it('ошибка записи даёт failed, понятное сообщение и не меняет записи', async () => {
    const store = signedInStore()
    const setItem = vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {
      throw new DOMException('Quota exceeded', 'QuotaExceededError')
    })
    try {
      await expect(store.dispatch(addNotification(own)).unwrap()).rejects.toContain(
        'Не хватает места',
      )
      expect(selectNotificationsStatus(store.getState())).toBe('failed')
      expect(selectNotificationsError(store.getState())).toContain('Не хватает места')
      expect(selectNotifications(store.getState())).toEqual([])
    } finally {
      setItem.mockRestore()
    }
  })

  it('ошибка загрузки не удаляет прежние записи', () => {
    const initial = {
      items: [own],
      status: 'loading' as const,
      pendingRequests: 1,
      error: null,
      loadError: null, // ← новое поле из P7-05: у загрузки ещё не было ошибки
    }
    const next = notificationsReducer(
      initial,
      // payload — текст ошибки из rejectWithValue; без него reducer подставит общий LOAD_NOTIFICATIONS
      fetchNotifications.rejected(null, 'request', undefined, DATA_ERRORS.LOAD_NOTIFICATIONS),
    )
    expect(next.items).toEqual([own])
    expect(next.status).toBe('failed')
    expect(next.error).toBe(DATA_ERRORS.LOAD_NOTIFICATIONS)
    // Ошибка загрузки дублируется в loadError — по ней панель покажет «Повторить»
    expect(next.loadError).toBe(DATA_ERRORS.LOAD_NOTIFICATIONS)
  })
  it.each(bulkActions)(
    'после частичной ошибки «$name» синхронизирует store с базой и позволяет повторить операцию',
    async ({ run }) => {
      const second = createNotification({ id: 'test-second', userId: own.userId })
      await saveNotification(own)
      await saveNotification(second)
      await saveNotification(other)
      const store = signedInStore()
      await store.dispatch(fetchNotifications()).unwrap()
      const realSetItem = Storage.prototype.setItem
      let writes = 0
      const setItem = vi.spyOn(Storage.prototype, 'setItem').mockImplementation(function (
        this: Storage,
        key,
        value,
      ) {
        writes += 1
        if (writes === 2) throw new DOMException('Quota', 'QuotaExceededError')
        realSetItem.call(this, key, value)
      })
      try {
        await expect(run(store)).rejects.toContain('Не хватает места')
        expect(store.getState().notifications.items).toEqual(await getNotifications())
        expect(selectNotificationsStatus(store.getState())).toBe('failed')
        expect(await getNotifications()).toContainEqual(other)
        await run(store)
        expect(selectNotificationsStatus(store.getState())).toBe('succeeded')
        expect(selectNotificationsError(store.getState())).toBeNull()
      } finally {
        setItem.mockRestore()
      }
    },
  )

  it('ошибку чтения базы преобразует в понятное сообщение', async () => {
    const read = vi
      .spyOn(notificationApi, 'getNotifications')
      .mockRejectedValueOnce(new Error('internal trace'))
    try {
      const store = signedInStore()
      await expect(store.dispatch(fetchNotifications()).unwrap()).rejects.toBe(
        'Не удалось загрузить уведомления. Попробуйте ещё раз',
      )
    } finally {
      read.mockRestore()
    }
  })
  it('прочитать все до первой загрузки сохраняет в store и уже просмотренные уведомления', async () => {
    const read = createNotification({ id: 'already-read', userId: own.userId, isRead: true })
    await saveNotification(own)
    await saveNotification(read)
    const store = signedInStore()
    await store.dispatch(markAllRead()).unwrap()
    expect(selectNotifications(store.getState())).toEqual([{ ...own, isRead: true }, read])
  })
  it('сохраняет loading, пока параллельная операция ещё не закончилась', async () => {
    const store = signedInStore()
    let finish!: (value: typeof own) => void
    const write = vi.spyOn(notificationApi, 'createNotification').mockImplementationOnce(
      () =>
        new Promise((resolve) => {
          finish = resolve
        }),
    )
    try {
      const pending = store.dispatch(addNotification(own))
      await store.dispatch(fetchNotifications()).unwrap()
      expect(store.getState().notifications.status).toBe('loading')
      finish(own)
      await pending.unwrap()
      expect(store.getState().notifications.status).toBe('succeeded')
    } finally {
      finish(own)
      write.mockRestore()
    }
  })
  it('ошибка параллельной операции не теряется после успешного завершения другой', async () => {
    const store = signedInStore()
    let finish!: (value: typeof own) => void
    const write = vi.spyOn(notificationApi, 'createNotification').mockImplementationOnce(
      () =>
        new Promise((resolve) => {
          finish = resolve
        }),
    )
    const read = vi
      .spyOn(notificationApi, 'getNotifications')
      .mockRejectedValueOnce(new Error('internal trace'))
    try {
      const pending = store.dispatch(addNotification(own))
      await store.dispatch(fetchNotifications())
      expect(store.getState().notifications.status).toBe('loading')
      finish(own)
      await pending.unwrap()
      expect(store.getState().notifications.status).toBe('failed')
      expect(store.getState().notifications.error).toBeTruthy()
      expect(store.getState().notifications.pendingRequests).toBe(0)
    } finally {
      finish(own)
      write.mockRestore()
      read.mockRestore()
    }
  })

  // --- новые P7-05 --- //
  it('записывает ошибку загрузки в loadError', () => {
    const state = notificationsReducer(
      undefined, // ← undefined: берём initialState из слайса
      fetchNotifications.rejected(null, 'req', undefined, DATA_ERRORS.LOAD_NOTIFICATIONS),
    )

    expect(state.error).toBe(DATA_ERRORS.LOAD_NOTIFICATIONS)
    expect(state.loadError).toBe(DATA_ERRORS.LOAD_NOTIFICATIONS)
    expect(state.status).toBe('failed')
  })

  it('не пишет в loadError ошибку операции «Прочитать все»', () => {
    const state = notificationsReducer(
      undefined,
      markAllRead.rejected(null, 'req', undefined, DATA_ERRORS.READ_NOTIFICATIONS),
    )

    expect(state.error).toBe(DATA_ERRORS.READ_NOTIFICATIONS)
    // Ошибка операции — не ошибка загрузки, кнопка «Повторить» не появится.
    expect(state.loadError).toBeNull()
  })

  it('сбрасывает loadError при повторной загрузке', () => {
    const withError = {
      items: [],
      status: 'failed' as const,
      pendingRequests: 0,
      error: DATA_ERRORS.LOAD_NOTIFICATIONS,
      loadError: DATA_ERRORS.LOAD_NOTIFICATIONS,
    }

    const state = notificationsReducer(withError, fetchNotifications.pending('req'))

    expect(state.loadError).toBeNull()
    expect(state.error).toBeNull()
    expect(state.status).toBe('loading')
  })
})
