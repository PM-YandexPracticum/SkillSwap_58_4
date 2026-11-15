import { useEffect } from 'react'
import { Outlet } from 'react-router-dom'
import { endSession, selectIsAuth } from '@/entities/session'
import { selectCurrentUser, selectUsersStatus } from '@/entities/user'
import { useAppDispatch, useAppSelector } from '@/shared/lib/store'

/** Сверяет сохранённую сессию с загруженными пользователями до открытия маршрутов. */
export function RestoreSession() {
  const dispatch = useAppDispatch()
  const isAuth = useAppSelector(selectIsAuth)
  const currentUser = useAppSelector(selectCurrentUser)
  const usersLoaded = useAppSelector(selectUsersStatus) === 'succeeded'
  const invalidSession = usersLoaded && isAuth && !currentUser

  useEffect(() => {
    if (invalidSession) dispatch(endSession())
  }, [dispatch, invalidSession])

  return invalidSession ? null : <Outlet />
}
