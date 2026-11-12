import { useEffect, useState } from 'react'
import { Navigate, Outlet } from 'react-router-dom'
import { fetchCategories, selectCategoriesStatus } from '@/entities/category'
import { fetchCities, selectCitiesStatus } from '@/entities/city'
import { fetchSkills, selectSkillsStatus } from '@/entities/skill'
import { fetchUsers, selectUsersStatus } from '@/entities/user'
import { ROUTES } from '@/shared/config'
import { useAppDispatch, useAppSelector } from '@/shared/lib/store'
import type { LoadingStatus } from '@/shared/types'
import { Loader } from '@/shared/ui/Loader'

function loadStartupData(dispatch: AppDispatch, getState: () => RootState) {
  // Повторный эффект в StrictMode видит loading, выставленный первым запуском.
  const { users, skills, categories, cities } = getState()
  const shouldLoad = (status: LoadingStatus) => status === 'idle' || status === 'failed'

  if (shouldLoad(users.status)) void dispatch(fetchUsers())
  if (shouldLoad(skills.status)) void dispatch(fetchSkills())
  if (shouldLoad(categories.status)) void dispatch(fetchCategories())
  if (shouldLoad(cities.status)) void dispatch(fetchCities())
}

/** Открывает маршруты после загрузки общих данных приложения. */
export function DataProvider() {
  const dispatch = useAppDispatch()
  const [started, setStarted] = useState(false)
  const statuses = [
    useAppSelector(selectUsersStatus),
    useAppSelector(selectSkillsStatus),
    useAppSelector(selectCategoriesStatus),
    useAppSelector(selectCitiesStatus),
  ]

  useEffect(() => {
    dispatch(loadStartupData)
    setStarted(true)
  }, [dispatch])

  if (statuses.every((status) => status === 'succeeded')) return <Outlet />
  // При возврате с /500 даём эффекту запустить повтор для упавших коллекций.
  if (started && statuses.includes('failed')) {
    return <Navigate to={ROUTES.SERVER_ERROR} replace />
  }
  return <Loader />
}
