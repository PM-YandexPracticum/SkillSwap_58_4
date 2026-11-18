import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

import { AvatarUpload } from '@/features/avatar-upload'
import { draftUpdated, selectRegisterDraft, stepCompleted, StepProfile } from '@/features/register'
import { ROUTES } from '@/shared/config'
import { useAppDispatch, useAppSelector } from '@/shared/lib/store'

/**
 * Шаг 2 «Расскажите немного о себе» — маршрут `/register/step-2`. Форма — `StepProfile` из features/register,
 * аватар — `AvatarUpload` из features/avatar-upload (слайсы features не импортируют друг друга, поэтому слот
 * собирает страница). Читает справочники категорий и городов, загруженные общим `DataProvider`.
 *
 * «Продолжить» сохраняет проверенные поля в черновик, отмечает шаг пройденным и открывает шаг 3.
 * «Назад» сохраняет введённое как есть (без проверки) и открывает шаг 1: ничего не стирается.
 * Аватар попадает в черновик сразу после выбора как готовый data URL (`draft.avatarPreviewUrl`):
 * `File` в store не кладём, при сохранении пользователя (P6-06) строку повторно не сжимаем.
 * Во время обработки фото продолжение заблокировано; уход назад или закрытие отменяет применение результата.
 * Загрузкой и ошибками справочников управляет `DataProvider`, страница не повторяет его проверки.
 *
 * @see Figma: «Регистрация 2 шаг» (1:1497 … 1:1717).
 */
export function RegisterStep2Page() {
  const navigate = useNavigate()
  const dispatch = useAppDispatch()
  const draft = useAppSelector(selectRegisterDraft)
  const [isAvatarProcessing, setIsAvatarProcessing] = useState(false)

  return (
    <StepProfile
      isBusy={isAvatarProcessing}
      defaultValues={{
        name: draft.name,
        birthDate: draft.birthDate,
        gender: draft.gender,
        cityId: draft.cityId,
        learnCategoryIds: draft.learnCategoryIds,
        learnSubcategoryIds: draft.learnSubcategoryIds,
      }}
      onBack={(values) => {
        dispatch(draftUpdated(values))
        navigate(ROUTES.REGISTER_STEP_1)
      }}
      onNext={(values) => {
        dispatch(draftUpdated(values))
        dispatch(stepCompleted(2))
        navigate(ROUTES.REGISTER_STEP_3)
      }}
      avatarUpload={
        <AvatarUpload
          onProcessingChange={setIsAvatarProcessing}
          value={draft.avatarPreviewUrl}
          onChange={(dataUrl) => dispatch(draftUpdated({ avatarPreviewUrl: dataUrl }))}
        />
      }
    />
  )
}
