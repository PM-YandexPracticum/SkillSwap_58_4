import { StrictMode } from 'react'
import { act, screen, waitFor, within } from '@testing-library/react'
import { Route, Routes } from 'react-router-dom'
import { createTestStore } from '@/app/test/createTestStore'
import { renderWithProviders } from '@/app/test/renderWithProviders'
import { startSession } from '@/entities/session'
import { fetchUsers } from '@/entities/user'
import { createUser } from '@/entities/user/testing'
import { fetchSkills } from '@/entities/skill'
import { createSkill } from '@/entities/skill/testing'
import { fetchExchanges, type Exchange } from '@/entities/exchange'
import {
  createNotification as saveNotification,
  fetchNotifications,
  getNotifications,
} from '@/entities/notification'
import { createNotification } from '@/entities/notification/testing'
import { DATA_ERRORS, MOCK_DB, ROUTES } from '@/shared/config'
import { MainLayout } from './MainLayout'

const account = createUser({ id: 'owner' })
const recipient = createUser({ id: 'recipient', name: 'Николай', teachSkillId: 'target' })
const notification = createNotification({
  id: 'notification',
  userId: account.id,
  toUserId: recipient.id,
  exchangeId: 'exchange',
})

function createStore() {
  const store = createTestStore()
  store.dispatch(fetchUsers.fulfilled([account, recipient], 'users'))
  store.dispatch(
    fetchSkills.fulfilled([createSkill({ id: 'target', authorId: recipient.id })], 'skills'),
  )
  store.dispatch(startSession(account.id))
  return store
}

function renderLayout(store = createStore()) {
  return renderWithProviders(
    <StrictMode>
      <Routes>
        <Route element={<MainLayout />}>
          <Route path={ROUTES.HOME} element={<h1>Каталог</h1>} />
          <Route path={ROUTES.SKILL} element={<h1>Страница навыка</h1>} />
        </Route>
      </Routes>
    </StrictMode>,
    { store },
  )
}

afterEach(() => vi.restoreAllMocks())

describe('MainLayout — уведомления', () => {
  it('до открытия панели загружает точку, сохраняет прочтение и очистку после перезагрузки', async () => {
    await saveNotification(notification)
    const first = renderLayout()
    const bell = await screen.findByRole('button', { name: 'Уведомления, есть новые' })
    expect(screen.queryByRole('region', { name: 'Уведомления' })).not.toBeInTheDocument()
    await first.user.click(bell)
    expect(screen.getByText('Вы предложили обмен Николаю')).toBeInTheDocument()
    await first.user.click(screen.getByRole('button', { name: 'Прочитать все' }))
    await screen.findByRole('heading', { name: 'Просмотренные' })
    expect(screen.queryByRole('button', { name: /^Перейти/ })).not.toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Уведомления' })).toBeInTheDocument()
    first.unmount()

    const second = renderLayout()
    await waitFor(() => expect(second.store.getState().notifications.status).toBe('succeeded'))
    await second.user.click(screen.getByRole('button', { name: 'Уведомления' }))
    expect(screen.getByRole('heading', { name: 'Просмотренные' })).toBeInTheDocument()
    await second.user.click(screen.getByRole('button', { name: 'Очистить' }))
    await screen.findByText('Уведомлений пока нет')
    second.unmount()

    const third = renderLayout()
    await waitFor(() => expect(third.store.getState().notifications.status).toBe('succeeded'))
    await third.user.click(screen.getByRole('button', { name: 'Уведомления' }))
    expect(screen.getByText('Уведомлений пока нет')).toBeInTheDocument()
  })

  it.each(['exchange', 'recipient'] as const)(
    'определяет навык по %s и закрывает окно после перехода',
    async (source) => {
      const store = createStore()
      store.dispatch(fetchNotifications.fulfilled([notification], 'notifications'))
      if (source === 'exchange') {
        const exchange: Exchange = {
          id: notification.exchangeId,
          fromUserId: account.id,
          toUserId: recipient.id,
          skillId: 'target',
          createdAt: notification.createdAt,
        }
        // Данные обмена приоритетны, даже если в профиле ссылка на навык устарела.
        store.dispatch(
          fetchUsers.fulfilled([account, { ...recipient, teachSkillId: 'old' }], 'users'),
        )
        store.dispatch(fetchExchanges.fulfilled([exchange], 'exchanges'))
      }
      const { user } = renderLayout(store)
      await user.click(screen.getByRole('button', { name: 'Уведомления, есть новые' }))
      await user.click(screen.getByRole('button', { name: /^Перейти/ }))
      expect(screen.getByRole('heading', { name: 'Страница навыка' })).toBeInTheDocument()
      expect(screen.queryByRole('region', { name: 'Уведомления' })).not.toBeInTheDocument()
    },
  )

  it('если навык недоступен, объясняет ошибку и не уводит на чужую страницу', async () => {
    const store = createStore()
    store.dispatch(fetchNotifications.fulfilled([notification], 'notifications'))
    store.dispatch(
      fetchSkills.fulfilled([createSkill({ id: 'target', authorId: 'other' })], 'skills'),
    )
    const { user } = renderLayout(store)
    await user.click(screen.getByRole('button', { name: 'Уведомления, есть новые' }))
    await user.click(screen.getByRole('button', { name: /^Перейти/ }))
    expect(screen.getByText(DATA_ERRORS.NOTIFICATION_TARGET)).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: 'Каталог' })).toBeInTheDocument()
  })

  it.each(['read', 'clear'] as const)(
    'ошибка %s не показывает ложный успех и позволяет повтор',
    async (action) => {
      const item = { ...notification, isRead: action === 'clear' }
      await saveNotification(item)
      const store = createStore()
      store.dispatch(fetchNotifications.fulfilled([item], 'notifications'))
      const { user } = renderLayout(store)
      await user.click(screen.getByRole('button', { name: /^Уведомления/ }))
      const write = vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {
        throw new DOMException('quota', 'QuotaExceededError')
      })
      const buttonName = action === 'read' ? 'Прочитать все' : 'Очистить'
      await user.click(screen.getByRole('button', { name: buttonName }))
      expect(screen.getByRole('button', { name: buttonName })).toBeDisabled()
      expect(await screen.findByRole('alert')).toHaveTextContent(DATA_ERRORS.STORAGE_FULL)
      expect(store.getState().notifications.items).toContainEqual(item)
      write.mockRestore()
      expect(await getNotifications()).toContainEqual(item)

      await user.click(screen.getByRole('button', { name: buttonName }))
      if (action === 'read') await screen.findByRole('heading', { name: 'Просмотренные' })
      else await screen.findByText('Уведомлений пока нет')
      expect(screen.queryByRole('alert')).not.toBeInTheDocument()
    },
  )

  it('запись начатой операции остаётся у её владельца при смене сессии', async () => {
    const foreign = createNotification({
      id: 'foreign',
      userId: recipient.id,
      toUserId: account.id,
    })
    await saveNotification(notification)
    await saveNotification(foreign)
    const { user, store } = renderLayout()
    await user.click(await screen.findByRole('button', { name: 'Уведомления, есть новые' }))
    await user.click(screen.getByRole('button', { name: 'Прочитать все' }))
    act(() => {
      store.dispatch(startSession(recipient.id))
    })
    await waitFor(() => expect(store.getState().notifications.status).toBe('succeeded'))
    await user.click(screen.getByRole('button', { name: 'Уведомления, есть новые' }))
    const panel = within(screen.getByRole('region', { name: 'Уведомления' }))
    expect(panel.getByText('Вы предложили обмен Ивану')).toBeInTheDocument()
    expect(panel.queryByText('Вы предложили обмен Николаю')).not.toBeInTheDocument()
    expect(await getNotifications()).toEqual(
      expect.arrayContaining([{ ...notification, isRead: true }, foreign]),
    )
  })

  it('Escape возвращает фокус на колокольчик, повторное открытие не загружает данные заново', async () => {
    const store = createStore()
    store.dispatch(fetchNotifications.fulfilled([notification], 'notifications'))
    const read = vi.spyOn(Storage.prototype, 'getItem')
    const { user } = renderLayout(store)
    const bell = screen.getByRole('button', { name: 'Уведомления, есть новые' })
    await user.click(bell)
    await user.tab()
    expect(screen.getByRole('region', { name: 'Уведомления' })).toHaveFocus()
    await user.keyboard('{Escape}')
    expect(bell).toHaveFocus()
    expect(bell).toHaveAttribute('aria-expanded', 'false')
    await user.click(bell)
    expect(
      read.mock.calls.filter(([key]) => key === `${MOCK_DB.STORAGE_PREFIX}notifications`),
    ).toHaveLength(0)
  })
})
