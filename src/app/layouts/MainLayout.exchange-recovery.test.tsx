import { screen, within } from '@testing-library/react'
import { Route, Routes } from 'react-router-dom'
import { createTestStore } from '@/app/test/createTestStore'
import { renderWithProviders } from '@/app/test/renderWithProviders'
import { CatalogPage } from '@/pages/catalog'
import { SkillPage } from '@/pages/skill'
import { fetchUsers } from '@/entities/user'
import { createUser } from '@/entities/user/testing'
import { fetchSkills } from '@/entities/skill'
import { createSkill } from '@/entities/skill/testing'
import { fetchCategories } from '@/entities/category'
import { fetchCities } from '@/entities/city'
import { fetchExchanges } from '@/entities/exchange'
import { fetchNotifications, selectNotifications, type Notification } from '@/entities/notification'
import { startSession } from '@/entities/session'
import { getSkillRoute, ROUTES } from '@/shared/config'
import { MainLayout } from './MainLayout'

const { saveNotification } = vi.hoisted(() => ({ saveNotification: vi.fn() }))
vi.mock('@/entities/notification/api/notificationApi', async (importOriginal) => {
  const actual =
    await importOriginal<typeof import('@/entities/notification/api/notificationApi')>()
  return {
    ...actual,
    ensureExchangeNotification: async (item: Notification) => {
      await saveNotification(item)
      return actual.ensureExchangeNotification(item)
    },
  }
})

afterEach(() => vi.restoreAllMocks())

it('MainLayout: после сбоя уведомления каталог оставляет доступ к навыку для повтора без дублей', async () => {
  vi.spyOn(window, 'scrollTo').mockImplementation(() => {})
  saveNotification.mockRejectedValueOnce(new Error('offline')).mockResolvedValue(undefined)
  const account = createUser({ id: 'sender', name: 'Алексей' })
  const author = createUser({ id: 'recipient', name: 'Иван' })
  const skill = createSkill({ authorId: author.id })
  const store = createTestStore()
  store.dispatch(fetchUsers.fulfilled([account, author], 'users'))
  store.dispatch(fetchSkills.fulfilled([skill], 'skills'))
  store.dispatch(fetchCategories.fulfilled([], 'categories'))
  store.dispatch(fetchCities.fulfilled([], 'cities'))
  store.dispatch(fetchExchanges.fulfilled([], 'exchanges'))
  store.dispatch(fetchNotifications.fulfilled([], 'notifications'))
  store.dispatch(startSession(account.id))
  const { user } = renderWithProviders(
    <Routes>
      <Route element={<MainLayout />}>
        <Route path={ROUTES.HOME} element={<CatalogPage />} />
        <Route path={ROUTES.SKILL} element={<SkillPage />} />
      </Route>
    </Routes>,
    { route: getSkillRoute(skill.id), store },
  )
  await user.click(screen.getByRole('button', { name: 'Предложить обмен' }))
  await screen.findByRole('alert', undefined, { timeout: 4000 })
  await user.click(within(screen.getByRole('banner')).getByRole('link', { name: 'SkillSwap' }))
  const card = within(screen.getByRole('region', { name: 'Популярное' }))
    .getAllByRole('article')
    .find((item) => within(item).queryByRole('heading', { name: 'Иван' }))
  expect(card).toBeDefined()
  if (!card) return
  await user.click(within(card).getByRole('link', { name: 'Подробнее' }))
  await user.click(screen.getByRole('button', { name: 'Предложить обмен' }))
  await screen.findByRole('dialog', { name: 'Вы предложили обмен' }, { timeout: 4000 })
  expect(
    store.getState().exchanges.items.filter((item) => item.fromUserId === account.id),
  ).toHaveLength(1)
  expect(selectNotifications(store.getState())).toHaveLength(1)
  expect(saveNotification).toHaveBeenCalledTimes(2)
})
