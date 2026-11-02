import { render, type RenderOptions } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import type { ReactElement, ReactNode } from 'react'
import { Provider } from 'react-redux'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import { createAppStore, type AppStore } from '@/app/store'
import { ROUTER_FUTURE } from '@/shared/config'

export interface RenderWithProvidersOptions extends Omit<RenderOptions, 'wrapper'> {
  /** Начальное состояние store: `{ session: { session: { userId: 'u01', token: 't' } } }` */
  preloadedState?: Partial<RootState>
  /** Свой store, если нужен один на несколько рендеров. По умолчанию — новый `createAppStore()` */
  store?: AppStore
  /** Адрес, на котором «открыт» компонент. По умолчанию `/` */
  route?: string
  /**
   * Шаблон маршрута, если компонент читает параметры (`useParams`): `path: ROUTES.SKILL`, `route: '/skill/s01'`.
   * Без него компонент рендерится как есть, без `<Routes>`.
   */
  path?: string
}

/**
 * Рендер компонента в тесте вместе с Redux store и роутером — иначе `useAppSelector` и `<Link>` падают.
 * Каждый вызов создаёт новый store, поэтому тесты не влияют друг на друга.
 *
 * @example
 * // вошедший пользователь на странице навыка
 * const { user } = renderWithProviders(<SkillPage />, {
 *   preloadedState: { session: { session: { userId: 'u01', token: 't' } } },
 *   path: ROUTES.SKILL,
 *   route: getSkillRoute('s02'),
 * })
 * await user.click(screen.getByRole('button', { name: 'Предложить обмен' }))
 *
 * @returns всё, что возвращает `render` из Testing Library, плюс `store` и `user` (userEvent)
 */
export function renderWithProviders(
  ui: ReactElement,
  {
    preloadedState,
    store = createAppStore(preloadedState),
    route = '/',
    path,
    ...renderOptions
  }: RenderWithProvidersOptions = {},
) {
  function Wrapper({ children }: { children: ReactNode }) {
    return (
      <Provider store={store}>
        <MemoryRouter initialEntries={[route]} future={ROUTER_FUTURE}>
          {children}
        </MemoryRouter>
      </Provider>
    )
  }

  const element = path ? (
    <Routes>
      <Route path={path} element={ui} />
    </Routes>
  ) : (
    ui
  )

  return {
    store,
    user: userEvent.setup(),
    ...render(element, { wrapper: Wrapper, ...renderOptions }),
  }
}
