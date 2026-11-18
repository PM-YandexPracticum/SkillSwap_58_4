import { useEffect, useRef, useState } from 'react'
import { Navigate, useNavigate } from 'react-router-dom'

import { selectCategories, selectCategoriesStatus } from '@/entities/category'
import {
  completeRegistration,
  draftUpdated,
  registrationCancelled,
  selectRegisterDraft,
  selectRegistrationError,
  selectRegistrationStatus,
  StepSkill,
} from '@/features/register'
import { SkillForm, SkillPreviewModal } from '@/features/skill-create'
import { ROUTES } from '@/shared/config'
import { useAppDispatch, useAppSelector } from '@/shared/lib/store'
import { Loader } from '@/shared/ui/Loader'

import { buildSkillPreview } from '../lib/buildSkillPreview'

/**
 * Шаг 3 «Укажите, чем вы готовы поделиться» — маршрут `/register/step-3`. Форма — `SkillForm` из features/skill-create,
 * колонка шага — `StepSkill` из features/register (слайсы не импортируют друг друга, поэтому собирает страница).
 * Справочник категорий читает из store: его загружает общий `DataProvider`.
 * «Назад» ведёт на шаг 2, «Продолжить» сохраняет навык и фото в черновик и открывает превью «Ваше предложение».
 * «Готово» вызывает единый сценарий завершения регистрации; черновик хранит id для безопасного повтора.
 * Превью читает данные из черновика, локально хранится только его открытое состояние.
 * При уходе отменяется владение запросом: поздний ответ не запускает переход в каталог.
 * Успешный сценарий создаёт сессию и открывает каталог с одноразовым флагом `state.offerCreated`.
 *
 * P6-05: обязательные поля, связь категории с подкатегорией и проверка 1–4 изображений.
 * P6-06: сохранить связанные навык и пользователя, создать сессию и открыть окно в каталоге по одноразовому флагу.
 * @see Figma: «Регистрация 3 шаг» (1:1761), превью 1:1799, «Ваше предложение создано» 1:2950
 */
export function RegisterStep3Page() {
  const navigate = useNavigate()
  const dispatch = useAppDispatch()
  const categories = useAppSelector(selectCategories)
  const categoriesStatus = useAppSelector(selectCategoriesStatus)
  const registerDraft = useAppSelector(selectRegisterDraft)
  const completionStatus = useAppSelector(selectRegistrationStatus)
  const completionError = useAppSelector(selectRegistrationError)
  const isCompleting = completionStatus === 'loading'
  const requestId = useRef<string | null>(null)
  const [isPreviewOpen, setIsPreviewOpen] = useState(false)

  useEffect(
    () => () => {
      if (requestId.current) dispatch(registrationCancelled(requestId.current))
      requestId.current = null
    },
    [dispatch],
  )

  if (categoriesStatus === 'failed') return <Navigate to={ROUTES.SERVER_ERROR} replace />
  if (categoriesStatus !== 'succeeded') return <Loader />

  const savedSkill = registerDraft.skill
  const confirmRegistration = async () => {
    if (requestId.current || isCompleting) return
    const request = dispatch(completeRegistration())
    requestId.current = request.requestId
    const result = await request
    if (requestId.current !== request.requestId) return
    requestId.current = null
    if (completeRegistration.fulfilled.match(result)) {
      navigate(ROUTES.HOME, { state: { offerCreated: true } })
    }
  }

  return (
    <StepSkill
      skillForm={
        <SkillForm
          defaultValues={savedSkill ?? undefined}
          defaultImages={savedSkill?.imagePreviewUrls}
          onBack={() => navigate(ROUTES.REGISTER_STEP_2)}
          onSubmit={(values, images) => {
            dispatch(
              draftUpdated({
                skill: {
                  ...values,
                  imagePreviewUrls: images,
                },
              }),
            )
            setIsPreviewOpen(true)
          }}
        />
      }
      previewModal={
        isPreviewOpen &&
        savedSkill && (
          <SkillPreviewModal
            isOpen
            skill={buildSkillPreview(savedSkill, categories)}
            images={savedSkill.imagePreviewUrls}
            isBusy={isCompleting}
            error={completionError}
            onEdit={() => setIsPreviewOpen(false)}
            onConfirm={() => void confirmRegistration()}
          />
        )
      }
    />
  )
}
