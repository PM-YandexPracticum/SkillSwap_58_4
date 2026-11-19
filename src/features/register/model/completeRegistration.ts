import { createAsyncThunk } from '@reduxjs/toolkit'
import { selectCategories } from '@/entities/category'
import { selectCities } from '@/entities/city'
import { createNewSkill, getSkillById, updateDataSkill, type Skill } from '@/entities/skill'
import { startSession } from '@/entities/session'
import { createNewUser, getUserById, updateDataUser, type User } from '@/entities/user'
import { DATA_ERRORS } from '@/shared/config'
import { credentialsSchema, createProfileStepSchema } from './schema'
import { registrationAttemptPrepared } from './registerActions'

function isSameSkill(saved: Skill, expected: Skill): boolean {
  return (
    saved.id === expected.id &&
    saved.title === expected.title &&
    saved.description === expected.description &&
    saved.categoryId === expected.categoryId &&
    saved.subcategoryId === expected.subcategoryId &&
    saved.authorId === expected.authorId &&
    saved.createdAt === expected.createdAt &&
    saved.images.length === expected.images.length &&
    saved.images.every((image, index) => image === expected.images[index])
  )
}

function getValidationMessage(error: unknown): string {
  if (
    typeof error === 'object' &&
    error !== null &&
    'errors' in error &&
    Array.isArray(error.errors) &&
    typeof error.errors[0] === 'string'
  ) {
    return error.errors[0]
  }
  return 'Проверьте данные регистрации и выбранные направления'
}

function getWriteMessage(error: unknown, fallback: string): string {
  return typeof error === 'string' ? error : fallback
}

/**
 * Сохраняет навык перед пользователем, затем создаёт сессию.
 * Повтор использует прежние id и обновляет свою частично записанную пару.
 * Уже начатая запись может закончиться после ухода; последующие действия требуют актуального запроса.
 */
export const completeRegistration = createAsyncThunk<
  { skill: Skill; user: User },
  void,
  { state: RootState; rejectValue: string }
>(
  'register/complete',
  async (_, { dispatch, getState, rejectWithValue, requestId, signal }) => {
    const isCurrent = () => !signal.aborted && getState().register.completionRequestId === requestId
    const state = getState()
    const { draft } = state.register
    const categories = selectCategories(state)
    const cities = selectCities(state)

    if (state.categories.status !== 'succeeded' || state.cities.status !== 'succeeded') {
      return rejectWithValue('Не удалось проверить города и направления. Попробуйте ещё раз')
    }

    if (!draft.skill) {
      return rejectWithValue('Заполните данные навыка и выберите хотя бы одно фото')
    }

    try {
      await credentialsSchema.validate({ email: draft.email, password: draft.password })
      await createProfileStepSchema(
        cities.map((city) => city.id),
        categories,
      ).validate({
        name: draft.name,
        birthDate: draft.birthDate,
        gender: draft.gender,
        cityId: draft.cityId,
        learnCategoryIds: draft.learnCategoryIds,
        learnSubcategoryIds: draft.learnSubcategoryIds,
      })
    } catch (error) {
      return rejectWithValue(getValidationMessage(error))
    }

    if (!isCurrent()) return rejectWithValue(DATA_ERRORS.REGISTRATION_CANCELLED)

    const category = categories.find((item) => item.id === draft.skill?.categoryId)
    if (!category || !category.subcategories.some(({ id }) => id === draft.skill?.subcategoryId)) {
      return rejectWithValue('Выберите подкатегорию навыка из выбранной категории')
    }

    let attempt = draft.completion
    if (!attempt) {
      try {
        const now = new Date().toISOString()
        attempt = {
          userId: crypto.randomUUID(),
          skillId: crypto.randomUUID(),
          createdAt: now,
        }
      } catch {
        return rejectWithValue('Не удалось начать регистрацию. Попробуйте ещё раз')
      }
      dispatch(registrationAttemptPrepared(attempt))
    }

    const skillDraft = draft.skill
    const skill: Skill = {
      id: attempt.skillId,
      title: skillDraft.title,
      description: skillDraft.description,
      categoryId: skillDraft.categoryId,
      subcategoryId: skillDraft.subcategoryId,
      images: [...skillDraft.imagePreviewUrls],
      authorId: attempt.userId,
      createdAt: attempt.createdAt,
    }
    const user: User = {
      id: attempt.userId,
      name: draft.name,
      email: draft.email,
      password: draft.password,
      avatarUrl: draft.avatarPreviewUrl,
      birthDate: new Date(`${draft.birthDate}T00:00:00.000Z`).toISOString(),
      gender: draft.gender,
      cityId: draft.cityId,
      about: '',
      teachSkillId: skill.id,
      learnSubcategoryIds: [...draft.learnSubcategoryIds],
      likedUserIds: [],
      likesCount: 0,
      createdAt: attempt.createdAt,
    }

    try {
      const savedSkill = await getSkillById(skill.id)
      if (!isCurrent()) return rejectWithValue(DATA_ERRORS.REGISTRATION_CANCELLED)
      if (
        savedSkill &&
        (savedSkill.authorId !== skill.authorId || savedSkill.createdAt !== skill.createdAt)
      ) {
        return rejectWithValue(DATA_ERRORS.SAVE_SKILL)
      }
      if (!savedSkill) {
        await dispatch(createNewSkill(skill)).unwrap()
      } else if (!isSameSkill(savedSkill, skill)) {
        const { id, ...changes } = skill
        await dispatch(updateDataSkill({ id, changes })).unwrap()
      }
      if (!isCurrent()) return rejectWithValue(DATA_ERRORS.REGISTRATION_CANCELLED)
    } catch (error) {
      return rejectWithValue(getWriteMessage(error, DATA_ERRORS.SAVE_SKILL))
    }

    try {
      const savedUser = await getUserById(user.id)
      if (!isCurrent()) return rejectWithValue(DATA_ERRORS.REGISTRATION_CANCELLED)
      if (savedUser) {
        if (savedUser.teachSkillId !== skill.id || savedUser.createdAt !== user.createdAt) {
          return rejectWithValue(DATA_ERRORS.SAVE_USER)
        }
        const { id, ...changes } = user
        await dispatch(updateDataUser({ id, changes })).unwrap()
      } else {
        await dispatch(createNewUser(user)).unwrap()
      }
    } catch (error) {
      return rejectWithValue(getWriteMessage(error, DATA_ERRORS.SAVE_USER))
    }

    if (!isCurrent()) return rejectWithValue(DATA_ERRORS.REGISTRATION_CANCELLED)
    dispatch(startSession(user.id))
    return { skill, user }
  },
  {
    condition: (_, { getState }) => getState().register.completionStatus !== 'loading',
  },
)
