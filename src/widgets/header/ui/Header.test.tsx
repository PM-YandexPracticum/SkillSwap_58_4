import { StrictMode } from 'react'
import { act, screen, waitFor } from '@testing-library/react'
import { Route, Routes } from 'react-router-dom'

import { renderWithProviders } from '@/app/test/renderWithProviders'
import { setSort } from '@/features/catalog-filter'
import { selectSearchQuery } from '@/features/skill-search'
import { ROUTES, STORAGE_KEYS, VALIDATION } from '@/shared/config'
import { createTestStore } from '@/app/test/createTestStore'
import { startSession, endSession } from '@/entities/session'
import { fetchUsers } from '@/entities/user'
import { createUser } from '@/entities/user/testing'
import { fetchNotifications, type Notification } from '@/entities/notification'
import * as notifications from '@/entities/notification'
import { createNotification } from '@/entities/notification/testing'

import { Header, type HeaderProps } from './Header'

const account = createUser({ name: 'Мария', avatarUrl: '/images/avatars/u02.jpg' })
const authorized = (items: Notification[] = []) => {
  const store = createTestStore()
  store.dispatch(fetchUsers.fulfilled([account], 'users'))
  store.dispatch(startSession(account.id))
  store.dispatch(fetchNotifications.fulfilled(items, 'notifications'))
  return store
}
const renderHeader = (
  props: HeaderProps = {},
  route: string = ROUTES.HOME,
  store = createTestStore(),
) => renderWithProviders(<Header {...props} />, { route, store })

describe('Header', () => {
  describe('гость', () => {
    it('показывает «Войти» и «Зарегистрироваться», но не показывает кабинет', () => {
      renderHeader()

      expect(screen.getByRole('button', { name: 'Войти' })).toBeInTheDocument()
      expect(screen.getByRole('button', { name: 'Зарегистрироваться' })).toBeInTheDocument()
      expect(screen.queryByRole('link', { name: 'Избранное' })).not.toBeInTheDocument()
    })

    it('«О проекте» ведёт на страницу о проекте', () => {
      renderHeader()

      expect(screen.getByRole('link', { name: 'О проекте' })).toHaveAttribute('href', ROUTES.ABOUT)
    })

    it.each([
      ['Войти', ROUTES.LOGIN, 'Вход'],
      ['Зарегистрироваться', ROUTES.REGISTER_STEP_1, 'Регистрация'],
    ])('%s ведёт на нужную страницу', async (label, path, title) => {
      const { user } = renderWithProviders(
        <Routes>
          <Route path={ROUTES.HOME} element={<Header />} />
          <Route path={path} element={<h1>{title}</h1>} />
        </Routes>,
      )

      await user.click(screen.getByRole('button', { name: label }))

      expect(screen.getByRole('heading', { name: title })).toBeInTheDocument()
    })

    it('есть поле поиска и иконка темы', () => {
      renderHeader()

      expect(screen.getByRole('textbox', { name: 'Искать навык' })).toBeInTheDocument()
      expect(screen.getByRole('button', { name: 'Сменить тему' })).toBeInTheDocument()
    })

    it('применяет и очищает поиск через поле шапки', async () => {
      const { user, store } = renderHeader()
      await user.type(screen.getByRole('textbox', { name: 'Искать навык' }), '  Гитара  ')
      expect(selectSearchQuery(store.getState())).toBe('')

      await user.click(screen.getByRole('button', { name: 'Искать' }))
      expect(selectSearchQuery(store.getState())).toBe('Гитара')

      await user.click(screen.getByRole('button', { name: 'Очистить поиск' }))
      expect(selectSearchQuery(store.getState())).toBe('')
      expect(screen.getByRole('textbox', { name: 'Искать навык' })).toHaveFocus()
    })

    it('смена сортировки каталога не стирает черновик поиска', async () => {
      const { store, user } = renderHeader()
      await user.type(screen.getByRole('textbox', { name: 'Искать навык' }), 'Черновик')

      act(() => store.dispatch(setSort('oldest')))

      expect(screen.getByRole('textbox', { name: 'Искать навык' })).toHaveValue('Черновик')
    })

    it('«Все навыки» открывает и закрывает слот categoriesMenu', async () => {
      const { user } = renderHeader({ categoriesMenu: <p>Меню навыков</p> })

      const trigger = screen.getByRole('button', { name: 'Все навыки' })
      expect(trigger).toHaveAttribute('aria-expanded', 'false')

      await user.click(trigger)
      expect(screen.getByText('Меню навыков')).toBeInTheDocument()
      expect(trigger).toHaveAttribute('aria-expanded', 'true')

      await user.keyboard('{Escape}')
      expect(screen.queryByText('Меню навыков')).not.toBeInTheDocument()
    })
  })

  describe('вошедший', () => {
    it('вместо кнопок входа показывает колокольчик, сердечко и имя', () => {
      renderHeader({}, ROUTES.HOME, authorized())

      expect(screen.queryByRole('button', { name: 'Войти' })).not.toBeInTheDocument()
      expect(screen.getByRole('button', { name: 'Уведомления' })).toBeInTheDocument()
      expect(screen.getByRole('link', { name: 'Избранное' })).toHaveAttribute(
        'href',
        ROUTES.FAVORITES,
      )
      const trigger = screen.getByRole('button', { name: 'Мария' })
      expect(trigger.querySelector('img')).toHaveAttribute('src', account.avatarUrl)
    })

    it('сообщает скринридеру о непрочитанных уведомлениях', () => {
      renderHeader({}, ROUTES.HOME, authorized([createNotification({ userId: account.id })]))

      expect(screen.getByRole('button', { name: 'Уведомления, есть новые' })).toBeInTheDocument()
    })

    it('объявляет состояние окна уведомлений', async () => {
      const { user } = renderHeader(
        { notifications: <p>Список уведомлений</p> },
        ROUTES.HOME,
        authorized(),
      )

      const trigger = screen.getByRole('button', { name: 'Уведомления' })
      expect(trigger).toHaveAttribute('aria-expanded', 'false')

      await user.click(trigger)

      expect(trigger).toHaveAttribute('aria-expanded', 'true')
      expect(trigger).toHaveAttribute(
        'aria-controls',
        screen.getByRole('region', { name: 'Уведомления' }).id,
      )

      await user.keyboard('{Escape}')

      expect(trigger).toHaveAttribute('aria-expanded', 'false')
      expect(screen.queryByRole('region', { name: 'Уведомления' })).not.toBeInTheDocument()
    })

    it('не объявляет меню открытым, если слот уведомлений не передан', () => {
      renderHeader({}, ROUTES.HOME, authorized())

      const trigger = screen.getByRole('button', { name: 'Уведомления' })
      expect(trigger).toHaveAttribute('aria-expanded', 'false')
      expect(trigger).not.toHaveAttribute('aria-controls')
    })

    it('не открывает категории без переданного слота', async () => {
      const { user } = renderHeader()

      const trigger = screen.getByRole('button', { name: 'Все навыки' })
      await user.click(trigger)

      expect(trigger).toHaveAttribute('aria-expanded', 'false')
    })

    it('на странице избранного сердечко отмечено как текущая страница', () => {
      renderHeader({}, ROUTES.FAVORITES, authorized())

      expect(screen.getByRole('link', { name: 'Избранное' })).toHaveAttribute(
        'aria-current',
        'page',
      )
    })

    it('колокольчик открывает слот notifications', async () => {
      const { user } = renderHeader(
        { notifications: <p>Список уведомлений</p> },
        ROUTES.HOME,
        authorized(),
      )

      await user.click(screen.getByRole('button', { name: 'Уведомления' }))

      expect(screen.getByText('Список уведомлений')).toBeInTheDocument()
    })

    it('меню пользователя: «Личный кабинет» — ссылка, «Выйти» завершает сессию', async () => {
      const { user, store } = renderHeader({}, ROUTES.HOME, authorized())

      const trigger = screen.getByRole('button', { name: 'Мария' })
      expect(trigger).not.toHaveAttribute('aria-controls')

      await user.click(trigger)
      expect(screen.getByRole('link', { name: 'Личный кабинет' })).toHaveAttribute(
        'href',
        ROUTES.PROFILE,
      )
      expect(trigger).toHaveAttribute('aria-controls', screen.getByRole('list').id)
      expect(screen.getByRole('link', { name: 'Личный кабинет' })).toBeInTheDocument()

      await user.click(screen.getByRole('button', { name: 'Выйти' }))
      expect(store.getState().session.session).toBeNull()
      expect(localStorage.getItem(STORAGE_KEYS.SESSION)).toBeNull()
      expect(screen.getByRole('button', { name: 'Войти' })).toBeInTheDocument()
      expect(screen.queryByRole('button', { name: 'Выйти' })).not.toBeInTheDocument()
    })

    it('одновременно открыто только одно меню', async () => {
      const { user } = renderHeader(
        {
          categoriesMenu: <p>Меню навыков</p>,
          notifications: <p>Список уведомлений</p>,
        },
        ROUTES.HOME,
        authorized(),
      )

      await user.click(screen.getByRole('button', { name: 'Все навыки' }))
      await user.click(screen.getByRole('button', { name: 'Уведомления' }))

      expect(screen.getByText('Список уведомлений')).toBeInTheDocument()
      expect(screen.queryByText('Меню навыков')).not.toBeInTheDocument()
    })

    it('до меню пользователя можно дойти с клавиатуры', async () => {
      const { user } = renderHeader({}, ROUTES.HOME, authorized())

      const trigger = screen.getByRole('button', { name: 'Мария' })
      for (let i = 0; i < 20 && document.activeElement !== trigger; i += 1) {
        await user.tab()
      }
      expect(trigger).toHaveFocus()

      await user.keyboard('{Enter}')
      expect(screen.getByRole('link', { name: 'Личный кабинет' })).toBeInTheDocument()
    })
  })
})

describe('Header — обновление store', () => {
  it('ошибка загрузки пользователей сохраняет сессию и доступ к меню выхода', async () => {
    const loaded = authorized().getState()
    const store = createTestStore({
      ...loaded,
      users: { ...loaded.users, items: [], status: 'failed' },
    })
    const { user } = renderHeader({}, ROUTES.SERVER_ERROR, store)

    expect(screen.queryByRole('button', { name: 'Войти' })).not.toBeInTheDocument()
    await user.click(screen.getByRole('button', { name: 'Меню пользователя' }))
    expect(screen.getByRole('button', { name: 'Выйти' })).toBeInTheDocument()
    expect(store.getState().session).toEqual(loaded.session)
  })

  it('сохраняет полное доступное имя пользователя максимальной длины', () => {
    const name = 'Ш'.repeat(VALIDATION.NAME.MAX)
    const store = authorized()
    store.dispatch(fetchUsers.fulfilled([{ ...account, name }], 'long-name'))
    renderHeader({}, ROUTES.HOME, store)

    expect(screen.getByRole('button', { name })).toBeInTheDocument()
    expect(screen.getByTitle(name)).toHaveTextContent(name)
  })

  it('переключает вид при входе и сразу показывает обновлённые имя и аватар', () => {
    const { store } = renderHeader()
    act(() => {
      store.dispatch(fetchUsers.fulfilled([account], 'users'))
      store.dispatch(startSession(account.id))
    })
    expect(screen.getByRole('button', { name: 'Мария' })).toBeInTheDocument()
    act(() =>
      store.dispatch(
        fetchUsers.fulfilled([{ ...account, name: 'Анна', avatarUrl: '/new.jpg' }], 'update'),
      ),
    )
    expect(screen.getByRole('button', { name: 'Анна' }).querySelector('img')).toHaveAttribute(
      'src',
      '/new.jpg',
    )
    act(() => store.dispatch(endSession()))
    expect(screen.getByRole('button', { name: 'Войти' })).toBeInTheDocument()
  })

  it('чужое новое и своё прочитанное уведомления не показывают точку', () => {
    renderHeader(
      {},
      ROUTES.HOME,
      authorized([
        createNotification({ id: 'other', userId: 'another-user' }),
        createNotification({ id: 'own', userId: account.id, isRead: true }),
      ]),
    )
    expect(screen.getByRole('button', { name: 'Уведомления' })).toBeInTheDocument()
    expect(
      screen.queryByRole('button', { name: 'Уведомления, есть новые' }),
    ).not.toBeInTheDocument()
  })

  it('Escape из меню возвращает фокус на имя, клик снаружи закрывает меню', async () => {
    const { user } = renderHeader({}, ROUTES.HOME, authorized())
    const trigger = screen.getByRole('button', { name: 'Мария' })
    await user.click(trigger)
    await user.tab()
    expect(screen.getByRole('link', { name: 'Личный кабинет' })).toHaveFocus()
    await user.keyboard('{Escape}')
    expect(trigger).toHaveFocus()
    expect(trigger).toHaveAttribute('aria-expanded', 'false')
    await user.click(trigger)
    await user.click(screen.getByRole('link', { name: 'О проекте' }))
    expect(screen.queryByRole('button', { name: 'Выйти' })).not.toBeInTheDocument()
  })

  it('восстанавливает свои непрочитанные до открытия панели без повторов в StrictMode', async () => {
    const saved = authorized().getState()
    localStorage.setItem(
      'skillswap_db_notifications',
      JSON.stringify([createNotification({ userId: account.id })]),
    )
    const store = createTestStore({
      ...saved,
      notifications: { items: [], status: 'idle', error: null, pendingRequests: 0 },
    })
    const loads = vi.spyOn(notifications, 'fetchNotifications')
    try {
      renderWithProviders(
        <StrictMode>
          <Header />
        </StrictMode>,
        { store },
      )
      expect(
        await screen.findByRole('button', { name: 'Уведомления, есть новые' }),
      ).toBeInTheDocument()
      await waitFor(() => expect(store.getState().notifications.pendingRequests).toBe(0))
      expect(loads).toHaveBeenCalledTimes(1)
    } finally {
      loads.mockRestore()
    }
  })
})
