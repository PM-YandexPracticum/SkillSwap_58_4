import { screen } from '@testing-library/react'
import { Link, useParams } from 'react-router-dom'
import { selectIsAuth } from '@/entities/session'
import { getSkillRoute, ROUTES } from '@/shared/config'
import { useAppSelector } from '@/shared/lib/store'
import { renderWithProviders } from './renderWithProviders'

function Probe() {
  const isAuth = useAppSelector(selectIsAuth)
  const { id } = useParams()

  return (
    <>
      <Link to={ROUTES.PROFILE}>{isAuth ? 'Профиль' : 'Войти'}</Link>
      {id && <p>Навык {id}</p>}
    </>
  )
}

describe('renderWithProviders', () => {
  it('рендерит компонент со store и роутером', () => {
    renderWithProviders(<Probe />)

    expect(screen.getByRole('link', { name: 'Войти' })).toHaveAttribute('href', ROUTES.PROFILE)
  })

  it('принимает начальное состояние store', () => {
    const { store } = renderWithProviders(<Probe />, {
      preloadedState: { session: { session: { userId: 'u01', token: 'test' } } },
    })

    expect(screen.getByRole('link', { name: 'Профиль' })).toBeInTheDocument()
    expect(store.getState().session.session?.userId).toBe('u01')
  })

  it('передаёт параметры маршрута, если указан path', () => {
    renderWithProviders(<Probe />, { path: ROUTES.SKILL, route: getSkillRoute('s02') })

    expect(screen.getByText('Навык s02')).toBeInTheDocument()
  })

  it('создаёт новый store на каждый рендер', () => {
    const first = renderWithProviders(<Probe />)
    first.unmount()
    const second = renderWithProviders(<Probe />)

    expect(second.store).not.toBe(first.store)
  })
})
