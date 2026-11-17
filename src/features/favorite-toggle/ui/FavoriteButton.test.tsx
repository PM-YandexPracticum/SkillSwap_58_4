import { screen } from '@testing-library/react'
import { useLocation } from 'react-router-dom'

import { createTestStore } from '@/app/test/createTestStore'
import { renderWithProviders } from '@/app/test/renderWithProviders'
import { fetchUsers } from '@/entities/user'
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
