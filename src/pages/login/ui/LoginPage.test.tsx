import { fireEvent, screen } from '@testing-library/react'
import { Navigate, Route, Routes, useLocation } from 'react-router-dom'

import { renderWithProviders } from '@/app/test/renderWithProviders'
import { createTestStore } from '@/app/test/createTestStore'
import { fetchUsers } from '@/entities/user'
import { createUser } from '@/entities/user/testing'
import { ROUTES, STORAGE_KEYS } from '@/shared/config'
import { LoginPage } from './LoginPage'

const account = createUser({ email: 'User@example.com', password: 'Pass1234' })

function Destination() {
  const { pathname, search, hash } = useLocation()
  return <h1>{pathname + search + hash}</h1>
}

function openLogin(from?: unknown) {
  const store = createTestStore()
  store.dispatch(fetchUsers.fulfilled([account], 'login-test'))
  return renderWithProviders(
    <Routes>
      <Route path="/test-start" element={<Navigate to={ROUTES.LOGIN} state={{ from }} />} />
      <Route path={ROUTES.LOGIN} element={<LoginPage />} />
      <Route path="*" element={<Destination />} />
    </Routes>,
    { route: from === undefined ? ROUTES.LOGIN : '/test-start', store },
  )
}

function submit(email: string, password: string) {
  fireEvent.change(screen.getByLabelText('Email'), { target: { value: email } })
  fireEvent.change(screen.getByLabelText('Пароль'), { target: { value: password } })
  fireEvent.submit(screen.getByRole('form', { name: 'Вход' }))
}

describe('LoginPage', () => {
  it('собирает форму входа, OAuth и иллюстрацию в одну основную область', () => {
    renderWithProviders(<LoginPage />)

    expect(screen.getAllByRole('main')).toHaveLength(1)
    expect(screen.getByRole('heading', { level: 1, name: 'Вход' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Продолжить с Google' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Продолжить с Apple' })).toBeInTheDocument()
    expect(screen.getByRole('form', { name: 'Вход' })).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: 'С возвращением в SkillSwap!' })).toBeInTheDocument()
  })

  it('ссылка регистрации открывает маршрут регистрации', async () => {
    const { user } = renderWithProviders(
      <Routes>
        <Route path={ROUTES.LOGIN} element={<LoginPage />} />
        <Route path={ROUTES.REGISTER} element={<h1>Первый шаг регистрации</h1>} />
      </Routes>,
      { route: ROUTES.LOGIN },
    )

    await user.click(screen.getByRole('link', { name: 'Зарегистрироваться' }))
    expect(screen.getByRole('heading', { name: 'Первый шаг регистрации' })).toBeInTheDocument()
  })

  it('входит без учёта регистра email и сохраняет сессию перед переходом в каталог', async () => {
    const { store } = openLogin()
    submit('USER@EXAMPLE.COM', account.password)

    expect(await screen.findByRole('heading', { name: '/' })).toBeInTheDocument()
    expect(store.getState().session.session?.userId).toBe(account.id)
    expect(JSON.parse(localStorage.getItem(STORAGE_KEYS.SESSION)!)).toEqual(
      store.getState().session.session,
    )
  })

  it('после входа возвращает на сохранённый путь с query и hash', async () => {
    openLogin({ pathname: '/skill/s01', search: '?from=catalog', hash: '#details' })
    submit(account.email, account.password)

    expect(
      await screen.findByRole('heading', { name: '/skill/s01?from=catalog#details' }),
    ).toBeInTheDocument()
  })

  it.each(['//example.com', '/\\example.com', 'https://example.com'])(
    'при внешнем адресе %s открывает каталог',
    async (pathname) => {
      openLogin({ pathname })
      submit(account.email, account.password)

      expect(await screen.findByRole('heading', { name: '/' })).toBeInTheDocument()
    },
  )

  it.each([
    ['unknown@example.com', account.password],
    [account.email, 'pass1234'],
  ])('показывает общую ошибку неверных данных и оставляет гостем', async (email, password) => {
    const { store } = openLogin()
    submit(email, password)

    expect(await screen.findByRole('alert')).toHaveTextContent('Email или пароль введён неверно')
    expect(screen.getByLabelText('Email')).toHaveAttribute('aria-invalid', 'true')
    expect(screen.getByLabelText('Пароль')).toHaveAttribute('aria-invalid', 'true')
    expect(store.getState().session.session).toBeNull()
    expect(localStorage.getItem(STORAGE_KEYS.SESSION)).toBeNull()
  })
})
