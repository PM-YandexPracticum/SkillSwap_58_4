import { createSelector } from '@reduxjs/toolkit'
import { selectSkills } from '@/entities/skill'
import { selectUsers, type PublicUser } from '@/entities/user'
import type { ID } from '@/shared/types'

/**
 * Похожие предложения для `/skill/:id`: другие авторы с предлагаемым навыком той же подкатегории.
 * Порядок пользователей сохраняется; отсутствующие навыки и ссылки на чужой навык пропускаются.
 * Композиция user и skill принадлежит странице; сущности не читают состояние друг друга.
 * Возвращает PublicUser[] без паролей и сохраняет ссылку при неизменных пользователях, навыках и id.
 */
export const selectSimilarUsers = createSelector(
  [selectUsers, selectSkills, (_state: RootState, skillId: ID) => skillId],
  (users, skills, skillId): PublicUser[] => {
    const skillsById = new Map(skills.map((skill) => [skill.id, skill]))
    const currentSkill = skillsById.get(skillId)
    if (!currentSkill?.subcategoryId) return []

    return users.filter((user) => {
      const teachSkill = skillsById.get(user.teachSkillId)
      return (
        user.id !== currentSkill.authorId &&
        teachSkill?.authorId === user.id &&
        teachSkill.subcategoryId === currentSkill.subcategoryId
      )
    })
  },
)
