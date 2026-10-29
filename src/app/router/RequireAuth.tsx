import type { ReactNode } from 'react'

interface RequireAuthProps {
  children: ReactNode
}

/**
 * Защита приватных маршрутов (/profile/*). Гостя отправляет на /login,
 * запоминая, откуда он пришёл (state.from), чтобы вернуть после входа.
 */
export function RequireAuth({ children }: RequireAuthProps) {
  // TODO: useAppSelector(selectIsAuth) ? children : <Navigate to={ROUTES.LOGIN} state={{ from }} />
  return <>{children}</>
}
