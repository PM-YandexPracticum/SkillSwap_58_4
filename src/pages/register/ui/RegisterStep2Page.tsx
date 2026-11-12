import { Navigate, useNavigate } from 'react-router-dom'

import { selectCategoriesStatus } from '@/entities/category'
import { selectCitiesStatus } from '@/entities/city'
import { AvatarUpload } from '@/features/avatar-upload'
import { StepProfile } from '@/features/register'
import { ROUTES } from '@/shared/config'
import { useAppSelector } from '@/shared/lib/store'
import { Loader } from '@/shared/ui/Loader'

/**
 * Шаг 2 «Расскажите немного о себе».
 * Читает справочники категорий и городов, загруженные общим `DataProvider`.
 * Форма реализована в `StepProfile`.
 *
 * @see Figma: «Регистрация 2 шаг» (1:1497 … 1:1717).
 */
export function RegisterStep2Page() {
  const navigate = useNavigate()
  const categoriesStatus = useAppSelector(selectCategoriesStatus)
  const citiesStatus = useAppSelector(selectCitiesStatus)

  if (categoriesStatus === 'failed' || citiesStatus === 'failed') {
    return <Navigate to={ROUTES.SERVER_ERROR} replace />
  }
  if (categoriesStatus !== 'succeeded' || citiesStatus !== 'succeeded') return <Loader />

  return (
    <StepProfile
      onBack={() => navigate(ROUTES.REGISTER_STEP_1)}
      onNext={() => navigate(ROUTES.REGISTER_STEP_3)}
      // TODO(P6-04): передать превью и обработчик выбора файла; сейчас только вёрстка.
      avatarUpload={<AvatarUpload value={null} onChange={() => undefined} />}
    />
  )
}
