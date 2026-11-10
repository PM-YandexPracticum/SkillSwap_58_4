
import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

import { fetchCategories } from '@/entities/category'
import { fetchCities } from '@/entities/city'
import { AvatarUpload } from '@/features/avatar-upload'
import { StepProfile } from '@/features/register'
import { ROUTES } from '@/shared/config'
import { useAppDispatch } from '@/shared/lib/store'

/**
 * Шаг 2 «Расскажите немного о себе».
 * Загружает справочники категорий и городов.
 * Форма реализована в `StepProfile`.
 *
 * @see Figma: «Регистрация 2 шаг».
 */
export function RegisterStep2Page() {
  const navigate = useNavigate()
  const dispatch = useAppDispatch()

  useEffect(() => {
    void dispatch(fetchCategories())
    void dispatch(fetchCities())
  }, [dispatch])

  return (
    <section>
      <StepProfile
        onBack={() => navigate(ROUTES.REGISTER_STEP_1)}
        onNext={() => navigate(ROUTES.REGISTER_STEP_3)}
        avatarUpload={<AvatarUpload value={null} onChange={() => {}} />}
      />
    </section>
  )
}
