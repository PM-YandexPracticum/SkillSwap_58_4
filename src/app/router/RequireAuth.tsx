import type { ReactNode } from 'react'
import { Navigate, useLocation } from 'react-router-dom'

import { selectIsAuth } from '@/entities/session'
import { ROUTES } from '@/shared/config'
import { useAppSelector } from '@/shared/lib/store'

interface RequireAuthProps {
  children: ReactNode
}

/**
 * Защита приватных маршрутов (/profile/*). Гостя отправляет на /login,
 * запоминая, откуда он пришёл (state.from), чтобы вернуть после входа.
 *
 * Логика, фрейм не требуется (P4-08).
 */
export function RequireAuth({ children }: RequireAuthProps) {
  const isAuth = useAppSelector(selectIsAuth) // true или false
  const location = useLocation() // объект { pathname, search, hash, state, key }

  if (!isAuth) {
    return <Navigate to={ROUTES.LOGIN} replace state={{ from: location }} />
  }

  return <>{children}</>
}
