import { useRef, useState } from 'react'
import { Navigate, useNavigate } from 'react-router-dom'

import { selectCategories, selectCategoriesStatus } from '@/entities/category'
import {
  completeRegistration,
  draftUpdated,
  selectRegisterDraft,
  selectRegistrationError,
  selectRegistrationStatus,
  StepSkill,
} from '@/features/register'
import { SkillForm, SkillPreviewModal, type SkillFormValues } from '@/features/skill-create'
import { ROUTES } from '@/shared/config'
import { useAppDispatch, useAppSelector } from '@/shared/lib/store'
import { Loader } from '@/shared/ui/Loader'

import { buildSkillPreview } from '../lib/buildSkillPreview'

interface SkillDraft {
  values: SkillFormValues
  /** Фото как data URL — в таком виде они показываются в превью и потом сохраняются */
  images: string[]
}

/**
 * Шаг 3 «Укажите, чем вы готовы поделиться» — маршрут `/register/step-3`. Форма — `SkillForm` из features/skill-create,
 * колонка шага — `StepSkill` из features/register (слайсы не импортируют друг друга, поэтому собирает страница).
 * Справочник категорий читает из store: его загружает общий `DataProvider`.
 * «Назад» ведёт на шаг 2, «Продолжить» сохраняет навык и фото в черновик и открывает превью «Ваше предложение».
 * «Готово» вызывает единый сценарий завершения регистрации; после записи навыка черновик хранит id для безопасного повтора.
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
  const isSkillSaved = Boolean(registerDraft.completion?.skillSaved)
  const confirming = useRef(false)
  const [draft, setDraft] = useState<SkillDraft | null>(null)

  if (categoriesStatus === 'failed') return <Navigate to={ROUTES.SERVER_ERROR} replace />
  if (categoriesStatus !== 'succeeded') return <Loader />

  const savedSkill = registerDraft.skill
  const previewDraft =
    draft ??
    (isSkillSaved && savedSkill
      ? {
          values: {
            title: savedSkill.title,
            categoryId: savedSkill.categoryId,
            subcategoryId: savedSkill.subcategoryId,
            description: savedSkill.description,
          },
          images: savedSkill.imagePreviewUrls,
        }
      : null)

  const confirmRegistration = async () => {
    if (confirming.current || isCompleting) return
    confirming.current = true
    const result = await dispatch(completeRegistration())
    if (completeRegistration.fulfilled.match(result)) {
      navigate(ROUTES.HOME, { state: { offerCreated: true } })
      return
    }
    confirming.current = false
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
            setDraft({ values, images })
          }}
        />
      }
      previewModal={
        previewDraft && (
          <SkillPreviewModal
            isOpen
            skill={buildSkillPreview(previewDraft.values, categories)}
            images={previewDraft.images}
            isBusy={isCompleting}
            isEditDisabled={isSkillSaved}
            error={completionError}
            onEdit={() => {
              if (!isCompleting && !isSkillSaved) setDraft(null)
            }}
            onConfirm={() => void confirmRegistration()}
          />
        )
      }
    />
  )
}
