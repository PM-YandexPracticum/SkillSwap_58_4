import { createSelector } from '@reduxjs/toolkit'
import { createLookup } from '@/shared/lib/createLookup'
import type { ID } from '@/shared/types'
import type { Skill } from './types'

/** Все навыки */
export const selectSkills = (state: RootState) => state.skills.items

/** Статус загрузки */
export const selectSkillsStatus = (state: RootState) => state.skills.status

/** Состояние записи; не влияет на стартовую загрузку приложения. */
export const selectSkillsSaveStatus = (state: RootState) => state.skills.saveStatus

/** Понятная ошибка последней группы записей, сбрасывается новой попыткой. */
export const selectSkillsSaveError = (state: RootState) => state.skills.saveError

const selectSkillsLookup = createSelector([selectSkills], (skills) =>
  createLookup(skills, (skill) => skill.id),
)

/** Навык по id через общий индекс; undefined, если он не найден. */
export const selectSkillById = (state: RootState, skillId: ID): Skill | undefined =>
  selectSkillsLookup(state)(skillId)

/** Предлагаемый навык автора: по модели у пользователя ровно одно предложение. */
export const selectSkillsByAuthor = (state: RootState, userId: ID): Skill | undefined =>
  selectSkills(state).find((skill) => skill.authorId === userId)
