import { ID } from '@/shared/types'
import { Skill } from './types'

/** Все навыки */
export const selectSkills = (state: RootState) => state.skills.items

/** Статус загрузки */
export const selectSkillsStatus = (state: RootState) => state.skills.status

export const selectSkillByID = (state: RootState, skillId: ID): Skill | undefined => {
  return selectSkills(state).find((item) => item.id === skillId)
}

export const selectSkillsByAuthor = (state: RootState, userID: ID): Skill | undefined => {
  return selectSkills(state).find((item) => item.authorId === userID)
}
