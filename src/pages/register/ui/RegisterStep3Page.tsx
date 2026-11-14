import { useState } from 'react'
import { Navigate, useNavigate } from 'react-router-dom'

import { selectCategories, selectCategoriesStatus } from '@/entities/category'
import { StepSkill } from '@/features/register'
import { SkillForm, SkillPreviewModal, type SkillFormValues } from '@/features/skill-create'
import { ROUTES } from '@/shared/config'
import { useAppSelector } from '@/shared/lib/store'
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
 * «Назад» ведёт на шаг 2, «Продолжить» открывает превью «Ваше предложение»: «Редактировать» возвращает к форме
 * с введёнными данными, «Готово» открывает каталог; окно «Ваше предложение создано» там покажет флаг
 * `state.offerCreated`. Значения формы и фото пока живут локально страницы; сохранение подключит P6-06.
 *
 * P6-05: обязательные поля, связь категории с подкатегорией и проверка 1–4 изображений.
 * TODO(P6-06): сохранить навык и пользователя, создать сессию и открыть окно в каталоге по флагу.
 * @see Figma: «Регистрация 3 шаг» (1:1761), превью 1:1799, «Ваше предложение создано» 1:2950
 */
export function RegisterStep3Page() {
  const navigate = useNavigate()
  const categories = useAppSelector(selectCategories)
  const categoriesStatus = useAppSelector(selectCategoriesStatus)
  const [draft, setDraft] = useState<SkillDraft | null>(null)

  if (categoriesStatus === 'failed') return <Navigate to={ROUTES.SERVER_ERROR} replace />
  if (categoriesStatus !== 'succeeded') return <Loader />

  return (
    <StepSkill
      skillForm={
        <SkillForm
          onBack={() => navigate(ROUTES.REGISTER_STEP_2)}
          onSubmit={(values, images) => setDraft({ values, images })}
        />
      }
      previewModal={
        draft && (
          <SkillPreviewModal
            isOpen
            skill={buildSkillPreview(draft.values, categories)}
            images={draft.images}
            onEdit={() => setDraft(null)}
            onConfirm={() => navigate(ROUTES.HOME, { state: { offerCreated: true } })}
          />
        )
      }
    />
  )
}
