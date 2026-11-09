import type { ID } from '@/shared/types'
import type { Skill } from './types'

/** Все навыки */
export const selectSkills = (state: RootState) => state.skills.items

/** Статус загрузки */
export const selectSkillsStatus = (state: RootState) => state.skills.status

/** Навык по id или undefined, если он не найден. */
export const selectSkillById = (state: RootState, skillId: ID): Skill | undefined =>
  selectSkills(state).find((skill) => skill.id === skillId)

/** Предлагаемый навык автора: по модели у пользователя ровно одно предложение. */
export const selectSkillsByAuthor = (state: RootState, userId: ID): Skill | undefined =>
  selectSkills(state).find((skill) => skill.authorId === userId)
