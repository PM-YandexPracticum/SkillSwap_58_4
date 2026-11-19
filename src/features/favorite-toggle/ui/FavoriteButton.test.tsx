import { act, screen, waitFor } from '@testing-library/react'
import { useLocation } from 'react-router-dom'

import { createTestStore } from '@/app/test/createTestStore'
import { renderWithProviders } from '@/app/test/renderWithProviders'
import { fetchUsers, createUser as saveUser, selectUserById } from '@/entities/user'
import { endSession } from '@/entities/session'
import { useAppSelector } from '@/shared/lib/store'
import { DATA_ERRORS } from '@/shared/config'
import { createUser } from '@/entities/user/testing'
import { FavoriteButton } from './FavoriteButton'

const account = createUser({ email: 'favorite@example.com', password: 'Pass1234' })

function LocationProbe() {
  const { pathname, state } = useLocation()
  return <output data-testid="location">{JSON.stringify({ pathname, from: state?.from })}</output>
}

describe('FavoriteButton', () => {
  it('показывает счётчик и сохраняет адрес возврата для гостя', async () => {
    const store = createTestStore({ session: { session: null } })
    store.dispatch(fetchUsers.fulfilled([account], 'favorite-test'))
    const { user } = renderWithProviders(
      <>
        <FavoriteButton userId={account.id} likesCount={12} />
        <LocationProbe />
      </>,
      { route: '/skill/s02?filter=popular#offers', store },
    )

    expect(screen.getByText('12')).toBeInTheDocument()
    await user.click(screen.getByRole('button', { name: 'Добавить в избранное' }))

    const location = JSON.parse(screen.getByTestId('location').textContent ?? '{}')
    expect(location.pathname).toBe('/login')
    expect(location.from).toMatchObject({
      pathname: '/skill/s02',
      search: '?filter=popular',
      hash: '#offers',
    })
  })

  it('не позволяет пользователю лайкнуть себя', () => {
    const store = createTestStore({
      session: { session: { userId: account.id, token: 'test-token' } },
    })
    store.dispatch(fetchUsers.fulfilled([account], 'favorite-test'))

    renderWithProviders(<FavoriteButton userId={account.id} likesCount={12} />, { store })

    expect(screen.getByRole('button', { name: 'Добавить в избранное' })).toBeDisabled()
  })
})

const target = createUser({ id: 'favorite-target', email: 'target@example.com', likesCount: 7 })

function ConnectedButton() {
  const user = useAppSelector((state) => selectUserById(state, target.id))
  return <FavoriteButton userId={target.id} likesCount={user?.likesCount ?? 0} />
}

async function setupButton() {
  await saveUser(account)
  await saveUser(target)
  const store = createTestStore({
    session: { session: { userId: account.id, token: 'test-token' } },
  })
  await store.dispatch(fetchUsers()).unwrap()
  return renderWithProviders(<ConnectedButton />, { store })
}

afterEach(() => vi.restoreAllMocks())

describe('сохранение лайка в интерфейсе', () => {
  it('показывает сохранённое состояние и новый счётчик; повторный клик снимает лайк', async () => {
    const { user } = await setupButton()
    const button = screen.getByRole('button', { name: 'Добавить в избранное' })
    await user.click(button)
    expect(button).toBeDisabled()
    await waitFor(() => expect(button).toHaveAttribute('aria-pressed', 'true'))
    expect(screen.getByLabelText('Количество лайков: 8')).toBeInTheDocument()
    await user.click(button)
    await waitFor(() => expect(button).toHaveAttribute('aria-pressed', 'false'))
    expect(screen.getByLabelText('Количество лайков: 7')).toBeInTheDocument()
  })

  it('показывает ошибку без изменения счётчика и позволяет повторить', async () => {
    const { user } = await setupButton()
    const write = vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {
      throw new DOMException('quota', 'QuotaExceededError')
    })
    await user.click(screen.getByRole('button', { name: 'Добавить в избранное' }))
    expect(await screen.findByText(DATA_ERRORS.STORAGE_FULL)).toBeInTheDocument()
    expect(screen.getByLabelText('Количество лайков: 7')).toBeInTheDocument()
    write.mockRestore()
    await user.click(screen.getByRole('button', { name: 'Добавить в избранное' }))
    await waitFor(() =>
      expect(screen.getByRole('button', { name: 'Убрать из избранного' })).toHaveAttribute(
        'aria-pressed',
        'true',
      ),
    )
  })

  it('не показывает позднюю ошибку после выхода из аккаунта', async () => {
    const { user, store } = await setupButton()
    vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {
      throw new DOMException('quota', 'QuotaExceededError')
    })
    await user.click(screen.getByRole('button', { name: 'Добавить в избранное' }))
    act(() => {
      store.dispatch(endSession())
    })
    await waitFor(() => expect(store.getState().favoriteToggle.pendingUserIds).toEqual([]))
    expect(screen.queryByText(DATA_ERRORS.STORAGE_FULL)).not.toBeInTheDocument()
  })
})

it('смена адресата не получает позднюю ошибку предыдущей карточки', async () => {
  const { store, unmount } = await setupButton()
  unmount()
  const { user, rerender } = renderWithProviders(
    <FavoriteButton userId={target.id} likesCount={7} />,
    { store },
  )
  vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {
    throw new DOMException('quota', 'QuotaExceededError')
  })
  await user.click(screen.getByRole('button', { name: 'Добавить в избранное' }))
  rerender(<FavoriteButton userId="new-recipient" likesCount={3} />)
  await waitFor(() => expect(store.getState().favoriteToggle.pendingUserIds).toEqual([]))
  expect(screen.queryByText(DATA_ERRORS.STORAGE_FULL)).not.toBeInTheDocument()
})
