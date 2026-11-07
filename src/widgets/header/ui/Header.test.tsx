import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter, Route, Routes } from 'react-router-dom'

import { ROUTER_FUTURE, ROUTES } from '@/shared/config'

import { Header, type HeaderProps } from './Header'

const renderHeader = (props: HeaderProps = {}, route: string = ROUTES.HOME) =>
  render(
    <MemoryRouter future={ROUTER_FUTURE} initialEntries={[route]}>
      <Header {...props} />
    </MemoryRouter>,
  )

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
      ['Зарегистрироваться', ROUTES.REGISTER, 'Регистрация'],
    ])('%s ведёт на нужную страницу', async (label, path, title) => {
      const user = userEvent.setup()
      render(
        <MemoryRouter future={ROUTER_FUTURE} initialEntries={[ROUTES.HOME]}>
          <Routes>
            <Route path={ROUTES.HOME} element={<Header />} />
            <Route path={path} element={<h1>{title}</h1>} />
          </Routes>
        </MemoryRouter>,
      )

      await user.click(screen.getByRole('button', { name: label }))

      expect(screen.getByRole('heading', { name: title })).toBeInTheDocument()
    })

    it('есть поле поиска и иконка темы', () => {
      renderHeader()

      expect(screen.getByRole('textbox', { name: 'Искать навык' })).toBeInTheDocument()
      expect(screen.getByRole('button', { name: 'Сменить тему' })).toBeInTheDocument()
    })

    it('«Все навыки» открывает и закрывает слот categoriesMenu', async () => {
      const user = userEvent.setup()
      renderHeader({ categoriesMenu: <p>Меню навыков</p> })

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
    const auth: HeaderProps = { isAuth: true, userName: 'Мария' }

    it('вместо кнопок входа показывает колокольчик, сердечко и имя', () => {
      renderHeader(auth)

      expect(screen.queryByRole('button', { name: 'Войти' })).not.toBeInTheDocument()
      expect(screen.getByRole('button', { name: 'Уведомления' })).toBeInTheDocument()
      expect(screen.getByRole('link', { name: 'Избранное' })).toHaveAttribute(
        'href',
        ROUTES.FAVORITES,
      )
      expect(screen.getByRole('button', { name: 'Мария' })).toBeInTheDocument()
    })

    it('сообщает скринридеру о непрочитанных уведомлениях', () => {
      renderHeader({ ...auth, hasUnread: true })

      expect(screen.getByRole('button', { name: 'Уведомления, есть новые' })).toBeInTheDocument()
    })

    it('объявляет состояние окна уведомлений', async () => {
      const user = userEvent.setup()
      renderHeader({ ...auth, notifications: <p>Список уведомлений</p> })

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
      renderHeader(auth)

      const trigger = screen.getByRole('button', { name: 'Уведомления' })
      expect(trigger).toHaveAttribute('aria-expanded', 'false')
      expect(trigger).not.toHaveAttribute('aria-controls')
    })

    it('не открывает категории без переданного слота', async () => {
      const user = userEvent.setup()
      renderHeader()

      const trigger = screen.getByRole('button', { name: 'Все навыки' })
      await user.click(trigger)

      expect(trigger).toHaveAttribute('aria-expanded', 'false')
    })

    it('на странице избранного сердечко отмечено как текущая страница', () => {
      renderHeader(auth, ROUTES.FAVORITES)

      expect(screen.getByRole('link', { name: 'Избранное' })).toHaveAttribute(
        'aria-current',
        'page',
      )
    })

    it('колокольчик открывает слот notifications', async () => {
      const user = userEvent.setup()
      renderHeader({ ...auth, notifications: <p>Список уведомлений</p> })

      await user.click(screen.getByRole('button', { name: 'Уведомления' }))

      expect(screen.getByText('Список уведомлений')).toBeInTheDocument()
    })

    it('меню пользователя: «Личный кабинет» — ссылка, «Выйти» вызывает onLogout', async () => {
      const user = userEvent.setup()
      const onLogout = vi.fn()
      renderHeader({ ...auth, onLogout })

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
      expect(onLogout).toHaveBeenCalledTimes(1)
      expect(screen.queryByRole('button', { name: 'Выйти' })).not.toBeInTheDocument()
    })

    it('одновременно открыто только одно меню', async () => {
      const user = userEvent.setup()
      renderHeader({
        ...auth,
        categoriesMenu: <p>Меню навыков</p>,
        notifications: <p>Список уведомлений</p>,
      })

      await user.click(screen.getByRole('button', { name: 'Все навыки' }))
      await user.click(screen.getByRole('button', { name: 'Уведомления' }))

      expect(screen.getByText('Список уведомлений')).toBeInTheDocument()
      expect(screen.queryByText('Меню навыков')).not.toBeInTheDocument()
    })

    it('до меню пользователя можно дойти с клавиатуры', async () => {
      const user = userEvent.setup()
      renderHeader(auth)

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
